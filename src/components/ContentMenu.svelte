<script lang="ts">
  export let show: boolean = true;
  let position = {
    x: 0,
    y: 0,
  };

  const mousemoveHandle = (e: MouseEvent) => {
    position = {
      x: e.clientX,
      y: e.clientY,
    };
  };
</script>

<svelte:body on:click={() => (show = false)} on:mousemove={mousemoveHandle} />
{#if show}
  <div
    class="menu"
    style={`left:${position.x}px;top:${position.y}px;`}
    on:click|stopPropagation
  >
    <slot />
  </div>
{/if}

<style lang="scss">
  .menu {
    position: fixed;
  }
</style>
