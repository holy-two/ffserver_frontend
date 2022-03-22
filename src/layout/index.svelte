<script context="module" lang="ts">
  export const tabs = ["File"];

  type Tab = "File" | "View" | (string & {});
</script>

<script lang="ts">
  import ToolPanelGroup from "../components/ToolPanelGroup.svelte";
  import { fade } from "svelte/transition";
  import ToolPanelSelect from "../components/ToolPanelSelect.svelte";
  import type { IMenu } from "../components/ToolPanelSelect.svelte";
  import PathNavbar from "../components/PathNavbar.svelte";

  export let pathSteps: string[] = [];

  let activeTab: Tab = "";

  let orderList: IMenu = {
    value: "name",
    list: ["name", "modify", "type", "size"],
  };

  const hiddenToolEject = () => {
    activeTab = "";
  };
</script>

<svelte:body on:click={hiddenToolEject} />
<div class="layout">
  <div class="header">
    <i class="iconfont icon-folder-fill header-icon" />
    <i class="iconfont icon-divider header-divider" />
    FFServer
  </div>
  <div class="tools">
    <div class="tabs">
      {#each tabs as tab, i}
        <div
          class="tab"
          class:extra={i === 0}
          class:active={activeTab === tab}
          on:click|stopPropagation={() => {
            if (activeTab === tab) {
              activeTab = "";
            } else {
              activeTab = tab;
            }
          }}
        >
          {tab}
        </div>
      {/each}
    </div>
    <div class="eject" on:click|stopPropagation>
      {#if activeTab === "File"}
        <div class="menu" out:fade={{ duration: 200 }}>
          <div class="menu-wrapper">
            <div class="menu-item">
              <i class="iconfont icon-upload" /> Upload File
            </div>
          </div>
        </div>
      {:else if activeTab === "View"}
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
        <div class="empty" />
      {/if}
    </div>
  </div>
  <PathNavbar {pathSteps} on:refresh on:changeNav />
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
            &:hover {
              background-color: rgb(237, 244, 252);
              border-color: rgb(168, 210, 253);
            }
            .iconfont {
              font-size: 30px;
              margin-right: 4px;
              color: rgb(68, 120, 210);
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
