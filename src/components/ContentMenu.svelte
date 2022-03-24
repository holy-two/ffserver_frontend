<script lang="ts">
  export let show: boolean = true;
  let position = {
    x: 0,
    y: 0,
  };

  const mousemoveHandle = (e: MouseEvent) => {
    if (!show) {
      position = {
        x: e.clientX,
        y: e.clientY,
      };
    }
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
    width: 262px;
    height: 300px;
    background-color: rgb(241, 241, 241);
    box-shadow: #aaa 3px 3px 4px;
    border: #aaa solid 1px;
  }
</style>
