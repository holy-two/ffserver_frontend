<script lang="ts">
  import { push } from "svelte-spa-router";
  import Layout from "../layout/index.svelte";
  export let params = { wild: "" };
</script>

<Layout>
  <div>{params.wild}</div>
  <button
    on:click={() => {
      push("/folder/a");
    }}>a</button
  >
</Layout>

<style lang="scss">
</style>
