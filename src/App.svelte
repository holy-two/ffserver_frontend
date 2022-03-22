<script lang="ts">
  import Router from "svelte-spa-router";
  import routes from "./routes";
</script>

<Router {routes} />

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
  }
  :global(body) {
    background-color: #fff;
    font-family: 微软雅黑, "Microsoft YaHei", Helvetica, Tahoma, sans-serif;
  }
</style>
