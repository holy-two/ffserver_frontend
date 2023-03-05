<script lang="ts" context="module">
  import type { FolderItem, FileItem, Item } from "../type";

  let refreshTimer: unknown;
  let refreshHiddenTimer: unknown;
</script>

<script lang="ts">
  import {
    download,
    ls,
    mkdir,
    move,
    rename,
    rm_f,
    rm_rf,
    upload,
  } from "../api/cmd";
  import dayjs from "dayjs";

  import Layout, { FileMenuType } from "../layout/index.svelte";
  import {
    defaultType,
    fileicon_map,
    filename_map,
    defaultIcon,
    PURE_FILE_TYPE,
  } from "../data/fileTypeMap";
  import { push, pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import type { EventKeys as LayoutEvents } from "../layout/index.svelte";
  import promiseCatch from "../util/promiseCatch";
  import ContentMenu from "../components/ContentMenu.svelte";
  import ContentMenuItem from "../components/ContentMenuItem.svelte";
  import { PURE_KEY_TYPE } from "../data/keybroadMap";
  import handleCustomRespose from "../util/handleCustomRespose";
  import ContentMenuGroup from "../components/ContentMenuGroup.svelte";
  import unImplWarm from "../util/unImplWarm";
  import useMenuState, { hideAll } from "../hooks/useMenuState";
  import { cutItem } from "../store";
  import parseMorePath from "../util/parseMorePath";
  export let params = { wild: "" };

  const fmtTime = (dt: Date | string | number) =>
    dayjs(dt).format("YYYY/MM/DD HH:mm");

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

  let itemList: Item[] = [];
  $: folderList = itemList.filter(
    (item) => item.type === "folder"
  ) as FolderItem[];
  $: fileList = itemList.filter((item) => item.type === "file") as FileItem[];
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
      itemList = [];
      ls(getCurretPath())
        .then((res) => {
          itemList = res.map((item) => {
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

  const getCurretPath = (isDecode: boolean = false) => {
    const cwd = location.hash.replace("#/folder", "/");
    return (isDecode ? decodeURIComponent(cwd) : cwd).replace("//", "/");
  };
  const itemPaste = async () => {
    if ($cutItem.fromPath === getCurretPath()) {
      $cutItem = null;
      refreshLs();
      return;
    }
    const from = parseMorePath(
      $cutItem.fromPath + "/" + $cutItem.itemValue.name
    );
    const to = parseMorePath(
      getCurretPath(true) + "/" + $cutItem.itemValue.name
    );
    const [res, err] = await promiseCatch(
      move(from, to, $cutItem.itemValue.type)
    );
    if (!err && res) {
      $cutItem = null;
      refreshLs();
    } else if (!res) {
      return;
    } else {
      alert(err);
    }
  };
  const itemCmds = async (type: FileMenuType) => {
    if (type === "mkdir") {
      const [res, err] = await promiseCatch<boolean, any>(
        mkdir(getCurretPath())
      );
      handleCustomRespose(res, err, refreshLs);
    } else if (type === "upload") {
      const [res, err] = await promiseCatch<boolean, any>(
        upload(getCurretPath())
      );
      handleCustomRespose(res, err, refreshLs);
    } else if (type === "paste") {
      await itemPaste();
    }
  };
  const fileMenuClickHandle = async (
    e: CustomEvent<LayoutEvents["FileMenuClick"]>
  ) => {
    const { type } = e.detail;
    await itemCmds(type);
  };

  const windowHashChangeHandle = async () => {
    refreshLs();
  };

  const isCutingItem = (item: Item) =>
    getCurretPath() === $cutItem?.fromPath &&
    $cutItem?.itemValue.name === item.name;

  const delFile = async () => {
    if (activeListItem.type === "file") {
      const [res, err] = await promiseCatch(
        rm_f(
          parseMorePath(getCurretPath() + "/" + activeListItem.name),
          activeListItem.name
        )
      );
      if (isCutingItem(activeListItem)) {
        $cutItem = null;
      }
      handleCustomRespose(res, err, refreshLs);
    }
  };
  const delFolder = async () => {
    if (activeListItem.type === "folder") {
      const [res, err] = await promiseCatch(
        rm_rf(
          parseMorePath(getCurretPath() + "/" + activeListItem.name),
          activeListItem.name
        )
      );
      if (isCutingItem(activeListItem)) {
        $cutItem = null;
      }
      handleCustomRespose(res, err, refreshLs);
    }
  };
  const handleDelKeyup = async (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === PURE_KEY_TYPE.Delete && activeListItem) {
      await delFile();
      await delFolder();
    }
  };

  const renameHandle = async () => {
    if (activeListItem) {
      const [res, err] = await promiseCatch(
        rename(
          parseMorePath(getCurretPath() + "/" + activeListItem.name),
          activeListItem.name,
          activeListItem.type
        )
      );
      handleCustomRespose(res, err, refreshLs);
    }
  };
  const itemCut = () =>
    activeListItem &&
    cutItem.set({
      fromPath: getCurretPath(),
      itemValue: activeListItem,
    });
  const mouseupCutHandle = async (e: KeyboardEvent) => {
    if (e.ctrlKey) {
      if (e.key === PURE_KEY_TYPE.X) return itemCut();
      if (e.key === PURE_KEY_TYPE.V) return await itemPaste();
    }
  };

  const [fileMenuX, fileMenuY, fileMenuShow] = useMenuState("file");
  const [folderMenuX, folderMenuY, folderMenuShow] = useMenuState("folder");
  const [systemMenuX, systemMenuY, systemMenuShow] = useMenuState("system");
</script>

<svelte:window on:hashchange={windowHashChangeHandle} />
<svelte:body
  on:contextmenu|preventDefault
  on:keyup|preventDefault={handleDelKeyup}
  on:keyup|preventDefault={mouseupCutHandle}
  on:blur={mouseupFileInfoHandle}
  on:mouseup={mouseupFileInfoHandle}
  on:mousemove={resizeFileInfoHandle}
/>

<Layout
  {pathSteps}
  on:refresh={() => {
    $cutItem = null;
    refreshLs();
  }}
  on:changeNav={refreshLs}
  on:FileMenuClick={fileMenuClickHandle}
  bind:pathNavLoading={refreshLoading}
>
  <div
    class="container"
    on:blur={mouseupFileInfoHandle}
    on:mouseup={mouseupFileInfoHandle}
    draggable={false}
  >
    <div
      class="content"
      on:contextmenu|preventDefault={() => {
        hideAll();
      }}
    >
      <div
        class="file-list"
        on:click={() => {
          hideAll();
          activeListItem = null;
        }}
        on:contextmenu|preventDefault|stopPropagation={(e) => {
          hideAll();
          activeListItem = null;
          $systemMenuShow = true;
          $systemMenuX = e.clientX;
          $systemMenuY = e.clientY;
        }}
      >
        <table on:contextmenu|stopPropagation|preventDefault>
          <thead>
            <tr>
              <th>Name</th>
              <th>Modififaction Time</th>
              <th>Type</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {#each folderList as item}
              <tr
                class:active={activeListItem === item}
                class:cutting={getCurretPath() === $cutItem?.fromPath &&
                  item.name === $cutItem?.itemValue.name}
                on:touchend={() => {
                  if (activeListItem === item) {
                    folderDbClick(item);
                  }
                }}
                on:contextmenu={(e) => {
                  activeListItem = item;
                  $folderMenuX = e.clientX;
                  $folderMenuY = e.clientY;
                }}
                on:contextmenu={() => {
                  hideAll();
                  $folderMenuShow = true;
                }}
                on:click|stopPropagation={() => {
                  activeListItem = item;
                  hideAll();
                }}
                on:dblclick={() => folderDbClick(item)}
              >
                <td>
                  <i class="iconfont icon-folder-fill" />
                  {item.name}
                </td>
                <td>{item.modify}</td>
                <td>Folder</td>
                <td />
              </tr>
            {/each}
            {#each fileList as item}
              <tr
                class:active={activeListItem === item}
                class:cutting={getCurretPath() === $cutItem?.fromPath &&
                  item.name === $cutItem?.itemValue.name}
                on:touchend={() => {
                  if (activeListItem === item) {
                    download(item.download, item.name);
                  }
                }}
                on:contextmenu={(e) => {
                  activeListItem = item;
                  $fileMenuX = e.clientX;
                  $fileMenuY = e.clientY;
                }}
                on:contextmenu={() => {
                  hideAll();
                  $fileMenuShow = true;
                }}
                on:click|stopPropagation={() => {
                  activeListItem = item;
                  hideAll();
                }}
                on:dblclick={() => download(item.download, item.name)}
              >
                <td>
                  <i
                    class="iconfont icon-{fileicon_map?.[item.fileType]?.icon ??
                      defaultIcon.icon}"
                    style={fileicon_map?.[item.fileType]?.color
                      ? `color:${fileicon_map?.[item.fileType]?.color}`
                      : ""}
                  />
                  {item.name}
                </td>
                <td>{item.modify}</td>
                <td>{PURE_FILE_TYPE[item.fileType]} File</td>
                <td>
                  {item.size}
                </td>
              </tr>
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
              {itemList.length} Items
            {/if}
          </div>
          <div class="type" style={`width:${fileInfoWidth - 40}px`}>
            {#if activeListItem && activeListItem.type === "file"}
              {PURE_FILE_TYPE[activeListItem.fileType]} File
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
        {itemList.length} Items
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
  <ContentMenu bind:show={$fileMenuShow} x={$fileMenuX} y={$fileMenuY}>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={itemCut}
        on:click={() => ($fileMenuShow = false)}>Cut</ContentMenuItem
      >
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={renameHandle}
        on:click={() => ($fileMenuShow = false)}>Rename</ContentMenuItem
      >
      <ContentMenuItem
        on:click={() => ($fileMenuShow = false)}
        on:click={delFile}>Delete</ContentMenuItem
      >
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={() => {
          if (activeListItem && activeListItem.type === "file") {
            download(activeListItem.download, activeListItem.name);
          }
        }}
        on:click={() => ($fileMenuShow = false)}
      >
        <i slot="icon" class="iconfont icon-download" style="color:#067fdb" />
        Download
      </ContentMenuItem>
      <ContentMenuItem
        on:click={unImplWarm}
        on:click={() => ($fileMenuShow = false)}
      >
        <i slot="icon" class="iconfont icon-qrcode" style="color:#333" />
        Create Download QRCode
      </ContentMenuItem>
    </ContentMenuGroup>
  </ContentMenu>
  <ContentMenu x={$folderMenuX} y={$folderMenuY} bind:show={$folderMenuShow}>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={itemCut}
        on:click={() => ($folderMenuShow = false)}>Cut</ContentMenuItem
      >
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={renameHandle}
        on:click={() => ($folderMenuShow = false)}>Rename</ContentMenuItem
      >
      <ContentMenuItem
        on:click={() => ($folderMenuShow = false)}
        on:click={delFolder}>Delete</ContentMenuItem
      >
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={unImplWarm}
        on:click={() => ($folderMenuShow = false)}
      >
        <i slot="icon" class="iconfont icon-qrcode" style="color:#333" />
        Create Share QRCode
      </ContentMenuItem>
    </ContentMenuGroup>
  </ContentMenu>
  <ContentMenu x={$systemMenuX} y={$systemMenuY} bind:show={$systemMenuShow}>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={() =>
          itemCmds("upload").then(() => ($systemMenuShow = false))}
      >
        <i slot="icon" class="iconfont icon-upload" style="color:#4478d2" />
        Upload File
      </ContentMenuItem>
      <ContentMenuItem
        on:click={() => itemCmds("mkdir").then(() => ($systemMenuShow = false))}
      >
        <i slot="icon" class="iconfont icon-new-folder" style="color:#f0d05f" />
        New Folder
      </ContentMenuItem>
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={async () => {
          await itemCmds("paste");
          $systemMenuShow = false;
        }}
        disabled={!$cutItem}>Paste</ContentMenuItem
      >
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={() => {
          refreshLs();
          $cutItem = null;
          $systemMenuShow = false;
        }}
      >
        Refresh
      </ContentMenuItem>
    </ContentMenuGroup>
    <ContentMenuGroup>
      <ContentMenuItem
        on:click={unImplWarm}
        on:click={() => {
          $systemMenuShow = false;
        }}
      >
        <i slot="icon" class="iconfont icon-info" style="color:#0066b4" />
        About
      </ContentMenuItem>
    </ContentMenuGroup>
  </ContentMenu>
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
        overflow: auto;
        height: 100%;
        table {
          width: 100%;
          min-width: 820px;
          border: none;
          border-collapse: unset;
          border-spacing: 0;
          thead {
            position: sticky;
            top: 0;
            background-color: #fff;
          }
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
              &.cutting {
                .iconfont {
                  opacity: 0.5;
                }
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
