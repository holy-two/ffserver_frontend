<script lang="ts">
  import Layout from "../layout/index.svelte";

  const getCurrentPath = () => location.hash.replace("#/download", "");
  const getDownloadData = () => getCurrentPath().slice(1);
</script>

<Layout showNavRefresh={false}>
  {getDownloadData()}
  <div slot="tabs" class="tabs" />
</Layout>

<style lang="scss">
</style>
