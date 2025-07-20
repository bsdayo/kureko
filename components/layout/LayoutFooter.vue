<template>
  <div class="bg-secondary p-4 flex justify-between text-sm text-muted-foreground">
    <div class="flex">
      <span>© {{ kurekoConfig?.footer.years }} {{ kurekoConfig?.author.name }}</span>
      <Separator v-if="kurekoConfig?.footer.icp?.enabled" class="mx-2" orientation="vertical" />
      <a
        v-if="kurekoConfig?.footer.icp?.enabled"
        :href="kurekoConfig.footer.icp.link"
        class="hover:underline underline-offset-4"
      >
        {{ kurekoConfig.footer.icp.text }}
      </a>
    </div>
    <div>Powered by Kureko</div>
  </div>
</template>

<script lang="ts" setup>
const kurekoConfig = useKurekoConfig()
</script>
