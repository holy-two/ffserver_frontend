<script lang="ts" context="module">
  interface IItem {
    name: string;
    modify: string;
    created: string;
  }

  interface FolderItem extends IItem {
    type: "folder";
  }
  interface FileItem extends IItem {
    type: "file";
    fileType: string;
    size: string;
  }

  type Item = FileItem | FolderItem;
</script>

<script lang="ts">
  import Layout from "../layout/index.svelte";
  export let params = { wild: "" };

  $: pathSteps = params.wild.split("/").filter((p) => !!p);
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

  let fileList: Item[] = [
    {
      type: "folder",
      name: ".test",
      modify: "2021/10/15 15:28",
      created: "2021/10/15 15:28",
    },
    {
      type: "file",
      name: "a.py",
      modify: "2021/10/15 15:28",
      created: "2021/10/15 15:28",
      fileType: "python",
      size: "200kB",
    },
    {
      type: "file",
      name: "a.js",
      modify: "2021/10/15 15:28",
      created: "2021/10/15 15:28",
      fileType: "javascript",
      size: "200kB",
    },
  ];
  let activeListItem: Item = null;
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
      <div class="file-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Modififaction Time</th>
              <th>Type</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {#each fileList as item}
              {#if item.type === "folder"}
                <tr
                  class:active={activeListItem === item}
                  on:click={() => (activeListItem = item)}
                >
                  <td>
                    <i class="iconfont icon-folder-fill" />
                    {item.name}
                  </td>
                  <td>{item.modify}</td>
                  <td>{item.modify}</td>
                  <td />
                </tr>
              {:else}
                <tr
                  class:active={activeListItem === item}
                  on:click={() => (activeListItem = item)}
                >
                  <td>
                    <i class="iconfont icon-file" />
                    {item.name}
                  </td>
                  <td>{item.modify}</td>
                  <td>{item.modify}</td>
                  <td>
                    {item.size}
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
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
        <div class="data">
          <div class="title">
            {#if activeListItem}
              {activeListItem.name}
            {:else}
              {fileList.length} Items
            {/if}
          </div>
          <div class="type">
            {#if activeListItem && activeListItem.type === "file"}
              {activeListItem.fileType} File
            {/if}
          </div>
          <div class="icon">
            {#if activeListItem}
              {#if activeListItem.type === "folder"}
                <i class="iconfont icon-folder-fill" />
              {:else}
                <i class="iconfont icon-file" />
              {/if}
            {:else}
              <i class="iconfont icon-folder" />
            {/if}
          </div>
          {#if activeListItem}
            <div class="others">
              <class class="item">
                Modififaction Time:{activeListItem.modify}
              </class>
              {#if activeListItem.type === "file"}
                <div class="item">
                  Size:{activeListItem.size}
                </div>
              {/if}
              <div class="item">
                Created Time:{activeListItem.created}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="info">
        {fileList.length} Items
      </div>
      {#if activeListItem}
        <div class="info">
          Selected 1 {activeListItem.type}
        </div>
        {#if activeListItem.type === "file"}
          <div class="info">
            {activeListItem.size}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</Layout>

<style lang="scss">
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    user-select: none;
    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      .file-list {
        flex: 1;
        overflow: hidden;
        min-width: 820px;
        height: 100%;
        table {
          width: 100%;
          th {
            font-size: 12px;
            font-weight: normal;
            color: rgb(102, 102, 102);
            height: 36px;
            text-align: left;
            vertical-align: middle;
            padding-left: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            transition: all 0.2s ease-out;
            &:hover {
              background-color: rgb(217, 235, 249);
            }
            &:nth-child(1) {
              min-height: 300px;
            }
            &:nth-child(2) {
              width: 160px;
            }
            &:nth-child(3) {
              width: 200px;
            }
            &:nth-child(4) {
              width: 200px;
            }
          }
          tbody {
            tr {
              transition: all 0.2s ease-out;
              &.active {
                background-color: rgb(204, 232, 255);
              }

              &:not(.active) {
                &:hover {
                  background-color: rgb(217, 235, 249);
                  td {
                    border: none;
                  }
                }
              }
            }
          }
          td {
            font-size: 12px;
            text-align: left;
            vertical-align: middle;
            height: 24px;
            color: #333;
            padding-left: 20px;
            .iconfont {
              font-size: 16px;
              &.icon-folder-fill {
                color: #ffe896;
              }
            }
          }
        }
      }
      .file-info {
        @media screen and (max-width: 1023px) {
          display: none;
        }
        min-width: 278px;
        border-left: 1px #eee solid;
        position: relative;
        height: 100%;
        .data {
          color: #333;
          .title {
            font-size: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin: 0 20px;
          }
          .type {
            font-size: 14px;
            color: #444;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin: 0 20px;
            margin-top: 10px;
          }
          .icon {
            margin-left: 20px;
            margin-top: 10px;

            .iconfont {
              font-size: 80px;
              &.icon-file {
                color: #aaa;
              }
              &.icon-folder-fill,
              &.icon-folder {
                color: #ffe896;
              }
            }
          }
          .others {
            font-size: 12px;
            margin-top: 10px;
            .item {
              height: 20px;
              line-height: 20px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin: 0 20px;
            }
          }
        }
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
