<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button size="icon" variant="ghost">
        <CircleQuestionMark />
      </Button>
    </DialogTrigger>

    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>关于评论</DialogTitle>
        <DialogDescription>发布评论须知</DialogDescription>
      </DialogHeader>

      <div class="prose prose-sm dark:prose-invert">
        <p>你的评论是公开的，请不要发布敏感信息。</p>
        <p>发表评论时，你输入的信息（昵称、邮箱、网站、评论内容）会被记录。</p>
        <p>友善交流哦</p>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { CircleQuestionMark } from 'lucide-vue-next'
</script>

<style></style>
