<script context="module" lang="ts">
  export const tabs = ["File"];

  export type Tab = "File" | "View" | (string & {});

  interface FileMenuItem {
    text: string;
    type: FileMenuType;
    icon: string;
    disabled?: boolean;
  }

  export type FileMenuType = "upload" | "mkdir" | "paste";

  export interface EventKeys {
    FileMenuClick: {
      type: FileMenuType;
    };
  }
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import PathNavbar from "../components/PathNavbar.svelte";
  import { createEventDispatcher, tick } from "svelte";
  import useMenuState, { hideAll } from "../hooks/useMenuState";
  import { cutItem } from "../store";

  export let pathSteps: string[] = [];
  export let pathNavLoading: boolean = false;
  export let showNavRefresh: boolean = true;
  export let navRootPath: string = null;
  export let navRootIcon: string = null;
  export let navRootSimpleIcon: string = null;
  export let navRootIconColor: string = null;
  export let navRootSimpleIconColor: string = null;
  const dispatch = createEventDispatcher<EventKeys>();
  const tabShowConst = "__layout$tab-";
  const [, , fileTabShow] = useMenuState(tabShowConst + "File");
  const fileMenu: FileMenuItem[] = [
    {
      text: "Upload File",
      type: "upload",
      icon: "upload",
    },
    {
      text: "New Folder",
      type: "mkdir",
      icon: "new-folder",
    },
    {
      text: "Paste Item",
      type: "paste",
      icon: "paste",
      get disabled() {
        return $cutItem === null;
      },
    },
  ];
</script>

<div class="layout">
  <div class="header">
    <i class="iconfont icon-folder-fill header-icon" />
    <i class="iconfont icon-divider header-divider" />
    FFServer
  </div>
  <div class="tools">
    <slot name="tabs">
      <div class="tabs">
        <div
          class="tab extra"
          class:active={$fileTabShow}
          on:click|stopPropagation={() => {
            if ($fileTabShow) {
              hideAll();
            } else {
              hideAll();
              $fileTabShow = true;
            }
          }}
        >
          File
        </div>
      </div>
    </slot>
    <div class="eject" on:click|stopPropagation>
      {#if $fileTabShow}
        <div class="menu" out:fade={{ duration: 200 }}>
          <div class="menu-wrapper">
            {#each fileMenu as menu}
              <div
                class="menu-item"
                class:disabled={menu.disabled}
                on:click={() => {
                  if (!menu.disabled) {
                    dispatch("FileMenuClick", { type: menu.type });
                    tick().then(() => {
                      $fileTabShow = false;
                    });
                  }
                }}
              >
                <i class="iconfont icon-{menu.icon}" />
                {menu.text}
              </div>
            {/each}
          </div>
        </div>
        <!-- {:else if activeTab === "View"}
        <div class="panel" out:fade={{ duration: 200 }}>
          <ToolPanelGroup title="Current view">
            <ToolPanelSelect
              icon="order-list"
              name="OrderList"
              bind:menus={orderList}
              on:menuClick
            />
          </ToolPanelGroup>
        </div>
      {:else}
        <div class="empty" /> -->
      {/if}
    </div>
  </div>
  <PathNavbar
    {pathSteps}
    on:refresh
    on:changeNav
    bind:loading={pathNavLoading}
    showTools={showNavRefresh}
    rootIcon={navRootIcon}
    rootPath={navRootPath}
    rootSimpleIcon={navRootSimpleIcon}
    rootIconColor={navRootIconColor}
    rootSimpleIconColor={navRootSimpleIconColor}
  />
  <div class="slot-wrapper">
    <slot />
  </div>
</div>

<style lang="scss">
  .layout {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    top: 0;
    left: 0;
    overflow: hidden;
    .header {
      height: 28px;
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #333;
      user-select: none;
      &-divider {
        font-size: 12px;
        color: #999;
      }
      &-icon {
        font-size: 18px;
        color: rgb(255, 232, 150);
      }
    }
    .tools {
      position: relative;
      height: 26px;
      .tabs {
        height: 26px;
        display: flex;
        align-items: center;
        background-color: #fff;
        user-select: none;
        position: relative;
        &::after {
          content: "";
          width: 100%;
          position: absolute;
          bottom: 0px;
          height: 1px;
          background-color: #ddd;
          z-index: 0;
        }
        .tab {
          height: 26px;
          line-height: 24px;
          font-size: 12px;
          margin: 0 1px;
          padding: 0 12px;
          z-index: 1;
          transition: all 0.2s ease-out;
          box-sizing: border-box;
          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
          &:not(.extra) {
            position: relative;
            border: transparent solid 1px;
            border-bottom-color: #ddd;

            background-color: #fff;
            &:hover {
              border-color: #ddd;
            }
            &.active {
              border-color: #ddd;
              background-color: rgb(245, 246, 247);
            }
          }
          &.extra {
            background-color: rgb(0, 102, 180);
            color: #fff;
            &:hover {
              background-color: rgb(6, 127, 219);
            }
            &.active {
              background-color: rgb(0, 84, 148);
            }
          }
        }
      }
      .eject {
        position: relative;
        z-index: 99;
        .panel,
        .menu {
          position: absolute;
        }
        .menu {
          background-color: #ddd;
          width: 268px;
          min-height: 300px;
          border: #aaa solid 1px;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          user-select: none;
          &::after {
            content: "";
            display: block;
            width: 100%;
            min-height: 16px;
            border-top: #aaa solid 1px;
            background-color: rgb(254, 254, 255);
          }
          &-wrapper {
            flex: 1;
            background-color: rgb(251, 252, 253);
          }
          &-item {
            cursor: default;
            height: 38px;
            font-size: 12px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            border: transparent solid 1px;

            &.disabled {
              color: #999;
            }
            &:not(.disabled) {
              &:hover {
                background-color: rgb(237, 244, 252);
                border-color: rgb(168, 210, 253);
              }
            }
            .iconfont {
              font-size: 30px;
              margin-right: 4px;
              &.icon-upload {
                color: rgb(68, 120, 210);
              }
              &.icon-new-folder {
                color: #f0d05f;
              }
              &.icon-paste {
                color: rgb(134, 152, 181);
              }
            }
          }
        }
        .panel {
          width: 100%;
          top: 0;
          left: 0;
          background-color: rgb(245, 246, 247);
          height: 112px;
          box-shadow: #ccc 0 1px 3px;
          display: flex;
          align-items: center;
        }
      }
    }
    .slot-wrapper {
      height: calc(100vh - 28px - 26px - 40px);
    }
  }
</style>
