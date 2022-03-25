<script lang="ts">
  import { fade } from "svelte/transition";
  export let show: boolean = true;
  export let x = 0;
  export let y = 0;

  let menuThis: HTMLDivElement;
  $: offsetX = x > window.innerWidth - 262 - 10 ? x - 262 - 10 : x;
  $: offsetY =
    y > window.innerHeight - menuThis?.clientHeight ?? 0 - 10
      ? y - menuThis?.clientHeight ?? 0 - 10
      : y;
</script>

<svelte:body on:click={() => (show = false)} />
{#if show}
  <div
    class="menu"
    style={`left:${offsetX}px;top:${offsetY}px;`}
    on:click|stopPropagation
    bind:this={menuThis}
    in:fade={{ duration: 200 }}
  >
    <slot />
  </div>
{/if}

<style lang="scss">
  .menu {
    position: fixed;
    width: 262px;
    background-color: rgb(241, 241, 241);
    box-shadow: #aaa 3px 3px 4px;
    border: #aaa solid 1px;
    user-select: none;
  }
</style>
