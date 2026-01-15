<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import AtomicLink from './AtomicLink.vue'

interface AtomicButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'normal' | 'small'
  shape?: 'rectangle' | 'circle' | 'square'
  disabled?: boolean
  to?: RouteLocationRaw
}

const props = withDefaults(defineProps<AtomicButtonProps>(), {
  type: 'button',
  variant: 'contained',
  color: 'primary',
  size: 'normal',
  shape: 'rectangle',
  to: undefined,
})

const rootComponent = computed(() => {
  return props.to ? AtomicLink : 'button'
})

const BASIC_CLASS = 'atomic-button'
const rootClass = computed(() => {
  return [
    `${BASIC_CLASS}--${props.variant}`,
    `${BASIC_CLASS}--${props.color}`,
    `${BASIC_CLASS}--${props.shape}`,
    `${BASIC_CLASS}--${props.size}`,
  ]
})
</script>

<template>
  <component
    :is="rootComponent"
    :class="[BASIC_CLASS, ...rootClass]"
    :disabled="rootComponent === 'button' ? disabled : undefined"
    :to="to"
    :type="rootComponent === 'button' ? type : undefined"
  >
    <span v-if="$slots.prepend">
      <slot name="prepend" />
    </span>
    <span>
      <slot name="default" />
    </span>
    <span v-if="$slots.append">
      <slot name="append" />
    </span>
  </component>
</template>

<style scoped lang="scss">
$name: '.atomic-button';
$color-map: (
  primary: #1976d2,
  success: #72bf24,
  warning: #ffad0f,
  danger: #e52d27,
  info: #909399,
);

#{$name} {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  height: var(--button-size);
  font-size: 0.875rem;
  text-align: center;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  cursor: pointer;
  outline: none;
  line-height: 1.25rem;
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;

  &:disabled {
    cursor: not-allowed;
  }

  // variant
  &--contained {
    color: white;

    @each $color, $value in $color-map {
      &#{$name}--#{$color} {
        background-color: rgba($value, 1);

        &:not(:disabled):is(:hover, :focus) {
          background-color: rgba($value, 0.8);
        }

        &:not(:disabled):active {
          background-color: rgba($value, 0.6);
        }
      }
    }

    &:disabled {
      background: lightgray;
    }
  }

  &--outlined {
    background-color: transparent;

    @each $color, $value in $color-map {
      &#{$name}--#{$color} {
        color: rgba($value, 1);
        border-color: rgba($value, 1);

        &:not(:disabled):hover {
          color: white;
          background-color: rgba($value, 0.8);
          border-color: rgba($value, 0.8);
        }

        &:not(:disabled):active {
          color: white;
          background-color: rgba($value, 0.6);
          border-color: rgba($value, 0.6);
        }
      }
    }

    &:disabled {
      color: lightgray;
      border-color: lightgray;
    }
  }

  &--text {
    background-color: transparent;

    @each $color, $value in $color-map {
      &#{$name}--#{$color} {
        color: rgba($value, 1);

        &:not(:disabled):hover {
          color: rgba($value, 0.8);
        }

        &:not(:disabled):active {
          color: rgba($value, 0.6);
        }
      }
    }

    &:disabled {
      color: lightgray;
    }
  }

  // size
  &--normal {
    --button-size: 36px;
    --button-padding: 20px;
  }

  &--small {
    --button-size: 32px;
    --button-padding: 10px;
  }

  // shape
  &--rectangle {
    padding-right: var(--button-padding);
    padding-left: var(--button-padding);
    border-radius: 6px;
  }

  &--square {
    width: var(--button-size);
    border-radius: 6px;
  }

  &--circle {
    width: var(--button-size);
    border-radius: 9999px;
  }
}
</style>
