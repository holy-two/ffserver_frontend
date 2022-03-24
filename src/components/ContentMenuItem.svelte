<script lang="ts" context="module">
  export interface EventKeys {
    click: undefined;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let disabled: boolean = false;
  const dispatch = createEventDispatcher<EventKeys>();
</script>

<div
  class="item"
  on:click={() => {
    if (!disabled) {
      dispatch("click");
    }
  }}
  class:disabled
>
  <div class="icon">
    <slot name="icon" />
  </div>
  <div class="text">
    <slot />
  </div>
</div>

<style lang="scss">
  .item {
    display: flex;
    align-items: center;
    height: 28px;
    margin: 1px 2px;
    &.disabled {
      .text {
        color: #999;
      }
    }
    &:not(.disabled) {
      &:hover {
        background-color: #fff;
      }
    }
    .icon {
      width: 28px;
      text-align: center;
    }
    .text {
      font-size: 12px;
      color: #333;
    }
  }
</style>
