<script lang="ts" context="module">
  export interface IMenu {
    value: string;
    list: string[];
  }

  interface EventKeys {
    menuClick: {
      item: string;
    };
  }
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
  import { fade } from "svelte/transition";

  export let menus: IMenu;
  export let icon: string;
  export let name: string;

  const dispatch = createEventDispatcher<EventKeys>();

  let showMenu = false;

  const hiddenMenu = () => {
    showMenu = false;
  };

  onMount(() => {
    document.addEventListener("click", hiddenMenu, false);
  });
  onDestroy(() => {
    document.removeEventListener("click", hiddenMenu, false);
  });
</script>

<div
  class="select"
  class:active={showMenu}
  on:click|stopPropagation={() => (showMenu = !showMenu)}
>
  <div class="icon">
    <i class={["iconfont", `icon-${icon}`].filter((s) => !!s).join(" ")} />
  </div>
  <div class="name">{name}</div>
  <div class="down">
    <i class="iconfont icon-triangle-down" />
  </div>
  {#if showMenu}
    <div class="menu" out:fade on:click|stopPropagation>
      {#each menus.list as menu}
        <div
          class="item"
          class:active={menus.value === menu}
          on:click|stopPropagation={() => {
            menus.value = menu;
            tick().then(() => {
              showMenu = false;
              dispatch("menuClick", { item: menu });
            });
          }}
        >
          {menu}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .select {
    position: relative;
    user-select: none;
    cursor: default;
    border: transparent 1px solid;
    &:hover,
    &.active {
      background-color: rgb(237, 244, 252);
      border-color: rgb(168, 210, 253);
    }
    .icon {
      text-align: center;
      .iconfont {
        font-size: 36px;
        color: rgb(37, 126, 199);
      }
    }
    .name {
      font-size: 12px;
      text-align: center;
    }
    .down {
      text-align: center;
    }
    .menu {
      position: absolute;
      left: 0;
      top: calc(100% + 2px);
      background-color: rgb(251, 252, 253);
      min-width: 100%;
      box-sizing: border-box;
      border: #ddd solid 1px;
      box-shadow: #ddd 2px 1px 2px;
      .item {
        font-size: 12px;
        height: 25px;
        line-height: 25px;
        display: flex;
        overflow: hidden;
        position: relative;
        border: transparent 1px solid;
        &:hover {
          background-color: rgb(237, 244, 252);
          border-color: rgb(168, 210, 253);
        }
        &::before {
          content: "";
          width: 26px;
          display: block;
          border-right: #ddd solid 1px;
          margin-right: 6px;
        }
        &.active {
          &::after {
            content: "";
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: #000;
            border-radius: 4px;
            left: 11px;
            top: 11px;
          }
        }
      }
    }
  }
</style>
