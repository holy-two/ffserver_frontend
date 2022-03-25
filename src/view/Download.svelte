<script lang="ts">
  import Layout from "../layout/index.svelte";

  const getCurrentPath = () => location.hash.replace("#/download", "");
  const getDownloadData = () => getCurrentPath().slice(1);
  $: pathSteps = getCurrentPath()
    .replace("#/", "/")
    .split("/")
    .filter((s) => !!s);
</script>

<Layout
  showNavRefresh={false}
  {pathSteps}
  navRootIcon="icon-download"
  navRootIconColor="#4478d2"
  navRootPath="download"
>
  {getDownloadData()}
  <div slot="tabs" class="tabs" />
</Layout>

<style lang="scss">
</style>
