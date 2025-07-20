<template>
  <footer class="bg-secondary p-4 flex justify-between text-sm text-muted-foreground">
    <div class="flex">
      <span>© {{ kurekoConfig?.footer.years }} {{ kurekoConfig?.author.name }}</span>
      <Separator v-if="kurekoConfig?.footer.icp?.enabled" class="mx-2" orientation="vertical" />
      <a v-if="kurekoConfig?.footer.icp?.enabled" :href="kurekoConfig.footer.icp.link">
        {{ kurekoConfig.footer.icp.text }}
      </a>
    </div>
    <div>
      Powered by
      <a href="https://github.com/bsdayo/kureko">Kureko</a>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const kurekoConfig = useKurekoConfig()
</script>

<style scoped>
footer a:hover {
  text-decoration-line: underline;
  text-underline-offset: 4px;
}
</style>
