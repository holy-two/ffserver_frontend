<script lang="ts">
</script>

<div class="bar">
  <div class="steps">
    <div class="step prev">
      <i class="iconfont icon-prev" />
    </div>
    <div class="step next">
      <i class="iconfont icon-next" />
    </div>
    <div class="step back">
      <i class="iconfont icon-arrow-up" />
    </div>
  </div>
  <div class="path-nav active" />
  <div class="refresh">
    <i class="iconfont icon-refresh" />
  </div>
</div>

<style lang="scss">
  .bar {
    display: flex;
    height: 40px;
    align-items: center;
    user-select: none;
    .steps {
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
    }
    .refresh {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: #ddd 1px solid;
      transition: all 0.2s ease-out;
      margin-right: 10px;
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
