<script lang="ts">
</script>

<div class="group">
  <slot />
</div>

<style lang="scss">
  .group {
    position: relative;
    padding: 1px 0;
    &:not(:last-child) {
      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 20px);
        background-color: #aaa;
        height: 1px;
      }
    }
  }
</style>
