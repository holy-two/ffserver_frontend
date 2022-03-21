<script lang="ts">
  export let title = "";
</script>

<div class="group">
  <div class="group-items">
    <slot />
  </div>
  <div class="group-title">
    {title}
  </div>
</div>

<style lang="scss">
  .group {
    height: calc(100% - 4px);
    margin: 2px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    &-items {
      flex: 1;
    }
    &:last-child {
      border-right: #ddd solid 1px;
    }
    &-title {
      font-size: 12px;
      padding: 0 10px;
    }
  }
</style>
