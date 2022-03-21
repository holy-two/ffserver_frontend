<script lang="ts">
  import { push } from "svelte-spa-router";
  import Layout from "../layout/index.svelte";
  export let params = { wild: "" };

  $: pathSteps = params.wild.split("/");
</script>

<Layout {pathSteps}>
  <div>{params.wild}</div>
  <button
    on:click={() => {
      push("/folder/a");
    }}>a</button
  >
</Layout>

<style lang="scss">
</style>
