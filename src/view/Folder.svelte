<script lang="ts">
  import Layout from "../layout/index.svelte";
  export let params = { wild: "" };

  $: pathSteps = params.wild.split("/").filter((p) => !!p);
  let footerInfos: string[] = ["5 Items", "Selected 1 Item", "108kB"];
  let fileInfoWidth = 278;
  let fileInfoMovePoint = 0;
  let fileInfoResizable = false;
  let fileInfoThis: HTMLDivElement;
  const resizeFileInfoHandle = (e: MouseEvent) => {
    if (fileInfoResizable) {
      const change = e.pageX - fileInfoMovePoint;
      fileInfoThis.style.width = `${fileInfoWidth - change}px`;
    }
  };
  const mouseupFileInfoHandle = () => {
    fileInfoResizable = false;
    fileInfoWidth = fileInfoThis.clientWidth ?? 278;
  };
</script>

<svelte:body
  on:blur={mouseupFileInfoHandle}
  on:mouseup={mouseupFileInfoHandle}
  on:mousemove={resizeFileInfoHandle} />

<Layout {pathSteps}>
  <div
    class="container"
    on:blur={mouseupFileInfoHandle}
    on:mouseup={mouseupFileInfoHandle}
    draggable={false}
  >
    <div class="content">
      <div class="file-list" />
      <div class="file-info" bind:this={fileInfoThis}>
        <div
          class="moveable"
          class:active={fileInfoResizable}
          on:mousedown={(e) => {
            fileInfoResizable = true;
            fileInfoMovePoint = e.pageX;
          }}
          draggable={false}
        />
        <div class="data" />
      </div>
    </div>
    <div class="footer">
      {#each footerInfos as info}
        <div class="info">{info}</div>
      {/each}
    </div>
  </div>
</Layout>

<style lang="scss">
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      .file-list {
        flex: 1;
        overflow: hidden;
        min-width: 820px;
        height: 100%;
      }
      .file-info {
        @media screen and (max-width: 1023px) {
          display: none;
        }
        min-width: 278px;
        border-left: 1px #eee solid;
        position: relative;
        height: 100%;
        .moveable {
          position: absolute;
          top: 0;
          left: -5px;
          height: 100%;
          width: 5px;
          cursor: e-resize;
          &.active {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
          }
        }
      }
    }
    .footer {
      height: 24px;
      display: flex;
      align-items: center;
      .info {
        font-size: 12px;
        margin: 0 10px;
      }
    }
  }
</style>
