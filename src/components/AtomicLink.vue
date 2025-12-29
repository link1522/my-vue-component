<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import { useRouter, type RouteLocationRaw, type Router } from 'vue-router'
import { hasProtocol } from 'ufo'
import isFunction from '@/utils/isFunction'
import createIntersectionObserver from '@/helper/createIntersectionObserver'

interface AtomicLinkProps {
  to?: RouteLocationRaw
  target?: '_blank' | '_parent' | '_self' | '_top'
  external?: boolean
}

const props = withDefaults(defineProps<AtomicLinkProps>(), {
  to: '',
  target: undefined,
})

const router = useRouter()

const href = computed(() => {
  return typeof props.to === 'object' ? (router.resolve(props.to)?.href ?? null) : props.to
})

const isExternal = computed(() => {
  // 明確設定外部屬性
  if (props.external) {
    return true
  }

  // 有設定 target 但不是 _self，視為外部連結
  if (props.target && props.target !== '_self') {
    return true
  }

  // to 是 object 視為內部路由
  if (typeof props.to === 'object') {
    return false
  }

  // to 是空字串，或者有協定，視為外部連結
  return props.to === '' || hasProtocol(props.to, { acceptRelative: true })
})

/**
 * Prefetch
 */
async function preloadRouteComponents(
  to: RouteLocationRaw,
  router: Router & { _routePreloaded?: Set<string> },
): Promise<void> {
  const { path, matched } = router.resolve(to)

  if (!matched.length) return
  if (!router._routePreloaded) router._routePreloaded = new Set()
  if (router._routePreloaded.has(path)) return

  router._routePreloaded.add(path)

  const promises: Promise<any>[] = []

  const components = matched
    .map((component) => component.components?.default)
    .filter((component) => isFunction(component))

  for (const component of components) {
    const promise = Promise.resolve((component as Function)()).catch(() => {})
    promises.push(promise)
  }

  await Promise.all(promises)
}

const linkRef = ref<HTMLElement>()

const resolveRef = (instance: any) => {
  linkRef.value = (instance as ComponentPublicInstance)?.$el
}

let idleId: number
let unobserve: (() => void) | null = null

onMounted(() => {
  idleId = requestIdleCallback(() => {
    if (!linkRef.value) return

    const { observe } = createIntersectionObserver()
    unobserve = observe(linkRef.value, () => {
      unobserve?.()
      unobserve = null

      if (isExternal.value) return
      preloadRouteComponents(props.to, router)
    })
  })
})

onBeforeUnmount(() => {
  if (idleId) {
    cancelIdleCallback(idleId)
  }
  unobserve?.()
  unobserve = null
})
</script>

<template>
  <template v-if="!isExternal">
    <RouterLink :ref="resolveRef" :to="to">
      <slot name="default" />
    </RouterLink>
  </template>
  <template v-else>
    <a :href="href" rel="noopener noreferrer" :target="target">
      <slot name="default" />
    </a>
  </template>
</template>
