<script lang="ts" context="module">
  interface ParseStep {
    href: string;
    path: string;
  }

  interface EventKeys {
    refresh: undefined;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { link, pop } from "svelte-spa-router";
  export let pathSteps: string[] = [];
  let navActive = false;
  let navString = "";
  let parseSteps: ParseStep[] = [];
  $: {
    const result: ParseStep[] = [];
    for (let i = 0; i < pathSteps.length; i++) {
      if (i === 0) {
        result[i] = {
          path: pathSteps[i],
          href: `/folder/${pathSteps[i]}`,
        };
      } else {
        result[i] = {
          path: pathSteps[i],
          href: `${result[i - 1].href}/${pathSteps[i]}`,
        };
      }
    }
    parseSteps = result;
  }
  const dispatch = createEventDispatcher<EventKeys>();
</script>

<div class="bar">
  <div class="steps">
    <!-- <div class="step prev">
      <i class="iconfont icon-prev" />
    </div>
    <div class="step next">
      <i class="iconfont icon-next" />
    </div> -->
    <div class="step back" on:click={() => pop()}>
      <i class="iconfont icon-arrow-up" />
    </div>
  </div>
  <div class="path-nav" class:active={navActive}>
    {#if navActive}
      <div class="input">
        <input type="text" bind:value={navString} />
      </div>
    {:else}
      <div class="steps">
        <a href="/folder" use:link class="step main">
          <i
            class="iconfont {parseSteps.length === 0
              ? 'icon-server'
              : 'icon-folder-fill'}"
          />
          {parseSteps.length === 0 ? "FFServer" : ""}
        </a>
        {#each parseSteps as path}
          <i class="iconfont icon-step" />
          <a href={path.href} use:link class="step">
            {path.path}
          </a>
        {/each}
      </div>
    {/if}
  </div>
  <div class="refresh" on:click={() => dispatch("refresh")}>
    <i class="iconfont icon-refresh" />
  </div>
</div>

<style lang="scss">
  .bar {
    display: flex;
    height: 40px;
    align-items: center;
    user-select: none;
    & > .steps {
      display: flex;
      align-items: center;
      height: 100%;
      margin-left: 10px;
      .step {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        transition: all 0.2s ease-out;
        margin-right: 10px;
        color: rgb(128, 128, 128);
        &:not(.back) {
          &:hover {
            color: rgb(50, 152, 254);
          }
        }
        .iconfont {
          font-size: 12px;
          font-weight: bold;
        }
      }
      .back {
        .iconfont {
          font-weight: normal;
          font-size: 18px;
        }
        border: transparent 1px solid;
        &:hover {
          background-color: rgb(237, 244, 252);
          border-color: rgb(168, 210, 253);
        }
        &:active {
          background-color: rgb(202, 224, 250);
        }
      }
    }
    .path-nav {
      flex: 1;
      overflow: hidden;
      height: 30px;
      border: #ddd 1px solid;
      border-right: none;
      transition: all 0.2s ease-out;
      &.active {
        cursor: text;
        border: rgb(0, 120, 215) solid 1px;
      }
      .steps {
        display: flex;
        align-items: center;
        height: 100%;
        .icon-step {
          font-size: 20px;
          font-weight: bold;
          color: rgb(105, 105, 105);
        }
        .step {
          text-decoration: none;
          font-size: 14px;
          color: #333;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          transition: all 0.2s ease-out;
          box-sizing: border-box;
          border: transparent 1px solid;
          padding: 0 4px;
          &:hover {
            background-color: rgb(237, 244, 252);
            border-color: rgb(168, 210, 253);
          }

          &.main {
            font-size: 12px;
            .iconfont {
              font-size: 20px;
              &.icon-folder-fill {
                color: #ffe896;
              }
              &.icon-server {
                color: rgb(109, 199, 255);
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
    .refresh {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-out;
      margin-right: 10px;
      border: #ddd 1px solid;
      &:hover {
        background-color: rgb(237, 244, 252);
        border-color: rgb(168, 210, 253);
      }
      &:active {
        background-color: rgb(202, 224, 250);
      }
      .iconfont {
        font-weight: bold;
        font-size: 16px;
        color: rgb(128, 128, 128);
      }
    }
  }
</style>
