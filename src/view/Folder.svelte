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
    download: string;
  }

  type Item = FileItem | FolderItem;

  let refreshTimer: unknown;
  let refreshHiddenTimer: unknown;
</script>

<script lang="ts">
  import { download, ls, mkdir, upload } from "../api/cmd";
  import dayjs from "dayjs";

  import Layout from "../layout/index.svelte";
  import {
    defaultType,
    fileicon_map,
    filename_map,
    defaultIcon,
  } from "../data/fileTypeMap";
  import { push, pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import type { EventKeys as LayoutEvents } from "../layout/index.svelte";
  import promiseCatch from "../util/promiseCatch";
  import ContentMenu from "../components/ContentMenu.svelte";
  export let params = { wild: "" };

  const fmtTime = (dt: Date | string | number) =>
    dayjs(dt).format("YYYY/MM/DD hh:mm:ss");

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

  let fileList: Item[] = [];
  let activeListItem: Item = null;
  const folderDbClick = (item: FolderItem) => {
    let comePath = location.hash.replace("#/", "/");
    if (item.name[0] === "/") {
      comePath += item.name;
    } else {
      comePath += "/" + item.name;
    }
    push(comePath).then(() => {
      refreshLs();
    });
  };
  let refreshLoading = false;
  const refreshLs = () => {
    clearTimeout(refreshTimer as number);
    clearTimeout(refreshHiddenTimer as number);
    refreshLoading = true;
    refreshTimer = setTimeout(() => {
      fileList = [];
      ls(getCurretPath())
        .then((res) => {
          fileList = res.map((item) => {
            if (item.type === "folder") {
              return {
                type: "folder",
                name: item.name,
                modify: fmtTime(item.mtime),
                created: fmtTime(item.ctime),
              } as FolderItem;
            } else {
              const ftype = item.name.split(".");
              return {
                type: "file",
                name: item.name,
                modify: fmtTime(item.mtime),
                created: fmtTime(item.ctime),
                size: item.size,
                fileType:
                  filename_map?.[ftype.at(-1).toLowerCase()] ?? defaultType,
                download: `${getCurretPath()}/${item.name}`,
              } as FileItem;
            }
          });
        })
        .catch((err) => {
          console.log(err);
          pop();
        })
        .finally(() => {
          refreshHiddenTimer = setTimeout(() => {
            refreshLoading = false;
          }, 2000);
        });
    }, 300);
  };
  onMount(() => {
    refreshLs();
  });

  const getCurretPath = () =>
    location.hash.replace("#/folder", "/").replace("//", "/");

  const fileMenuClickHandle = async (
    e: CustomEvent<LayoutEvents["FileMenuClick"]>
  ) => {
    const { type } = e.detail;
    if (type === "mkdir") {
      const [res, err] = await promiseCatch<boolean, any>(
        mkdir(getCurretPath())
      );
      if (!err && res) {
        refreshLs();
      } else if (!res) {
        return;
      } else {
        alert(err);
      }
    } else if (type === "upload") {
      const [res, err] = await promiseCatch<boolean, any>(
        upload(getCurretPath())
      );
      if (!err && res) {
        refreshLs();
      } else if (!res) {
        return;
      } else {
        alert(err);
      }
    }
  };

  const windowHashChangeHandle = async () => {
    refreshLs();
  };
</script>

<svelte:window on:hashchange={windowHashChangeHandle} />
<svelte:body
  on:blur={mouseupFileInfoHandle}
  on:mouseup={mouseupFileInfoHandle}
  on:mousemove={resizeFileInfoHandle}
  on:contextmenu|preventDefault />

<Layout
  {pathSteps}
  on:refresh={refreshLs}
  on:changeNav={refreshLs}
  on:FileMenuClick={fileMenuClickHandle}
  bind:pathNavLoading={refreshLoading}
>
  <div
    class="container"
    on:click={() => (activeListItem = undefined)}
    on:blur={mouseupFileInfoHandle}
    on:mouseup={mouseupFileInfoHandle}
    draggable={false}
  >
    <div class="content">
      <div class="file-list">
        <table on:click|stopPropagation>
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
                  on:touchend={() => {
                    if (activeListItem === item) {
                      folderDbClick(item);
                    }
                  }}
                  on:dblclick={() => folderDbClick(item)}
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
                  on:touchend={() => {
                    if (activeListItem === item) {
                      download(item.download, item.name);
                    }
                  }}
                  on:contextmenu={() => {
                    activeListItem = item;
                  }}
                  on:dblclick={() => download(item.download, item.name)}
                  on:click|stopPropagation={() => (activeListItem = item)}
                >
                  <td>
                    <i
                      class="iconfont icon-{fileicon_map?.[item.fileType]
                        ?.icon ?? defaultIcon.icon}"
                      style={fileicon_map?.[item.fileType]?.color
                        ? `color:${fileicon_map?.[item.fileType]?.color}`
                        : ""}
                    />
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
            fileInfoWidth = fileInfoThis.clientWidth;
            fileInfoResizable = true;
            fileInfoMovePoint = e.pageX;
          }}
          draggable={false}
        />
        <div class="data">
          <div class="title" style={`width:${fileInfoWidth - 40}px`}>
            {#if activeListItem}
              {activeListItem.name}
            {:else}
              {fileList.length} Items
            {/if}
          </div>
          <div class="type" style={`width:${fileInfoWidth - 40}px`}>
            {#if activeListItem && activeListItem.type === "file"}
              {activeListItem.fileType} File
            {/if}
          </div>
          <div class="icon" style={`width:${fileInfoWidth - 40}px`}>
            {#if activeListItem}
              {#if activeListItem.type === "folder"}
                <i class="iconfont icon-folder-fill" />
              {:else}
                <i
                  class="iconfont icon-{fileicon_map?.[activeListItem.fileType]
                    ?.icon ?? defaultIcon.icon}"
                  style={fileicon_map?.[activeListItem.fileType]?.color
                    ? `color:${fileicon_map?.[activeListItem.fileType]?.color}`
                    : ""}
                />
              {/if}
            {:else}
              <i class="iconfont icon-folder" />
            {/if}
          </div>
          {#if activeListItem}
            <div class="others" style={`width:${fileInfoWidth - 40}px`}>
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

<div class="contentmenus">
  <ContentMenu />
</div>

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
          border: none;
          border-collapse: unset;
          border-spacing: 0;
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
            border: none;
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
            border: none;
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

  .contentmenu {
    position: fixed;
    z-index: 999999;
  }
</style>
