<template>
  <div class="max-w-prose mx-auto py-16">
    <div class="space-y-2">
      <LayoutHeading v-if="error?.statusCode === 404">
        欢迎使用 <a class="underline" href="https://github.com/bsdayo/kureko">Kureko</a>！
      </LayoutHeading>
      <LayoutHeading v-else>{{ content?.title }}</LayoutHeading>
    </div>

    <Separator class="my-8" />

    <div class="prose dark:prose-invert" v-if="content" v-html="html" />

    <div v-if="error?.statusCode === 404" class="prose dark:prose-invert">
      <p>这里的说明将指引你创建管理员账号，并编辑主页的内容。</p>

      <p>
        首先，你需要使用一个管理员账号登录。
        <a class="cursor-pointer" @click="loginWithGitHub">点击此处使用 GitHub 登录</a>。
      </p>
      <p v-if="user" class="text-sm text-green-600 dark:text-green-500 flex items-center gap-1">
        <Check class="size-4" />
        <span>已登录为 {{ user.name }}。</span>
      </p>
      <p v-else class="text-sm text-red-600 dark:text-red-500 flex items-center gap-1">
        <CircleAlert class="size-4" />
        <span>未登录</span>
      </p>

      <p>
        登录后，<a :href="pbAdminUrl">前往 PocketBase 管理界面</a>，在
        <code>users</code> 集合中，将你账号的 <code>owner</code> 属性设置为 <code>true</code>。
      </p>
      <p>
        设置后，你需要<a class="cursor-pointer" @click="loginWithGitHub">重新登录</a>以更新状态。
      </p>
      <p
        v-if="user?.owner"
        class="text-sm text-green-600 dark:text-green-500 flex items-center gap-1"
      >
        <Check class="size-4" />
        <span>当前登录用户已为管理员。</span>
      </p>
      <p v-else class="text-sm text-red-600 dark:text-red-500 flex items-center gap-1">
        <CircleAlert class="size-4" />
        <span>当前登录用户不为管理员。</span>
      </p>

      <p>
        现在，你可以<a class="cursor-pointer" @click="createHomeDraft">点击这里</a
        >进入主页的编辑页面。在编辑器中发布后，本说明将被覆盖。
      </p>
      <p>
        后续，你可以点击右上角的
        <Command class="inline-block -translate-y-[2px] size-4" />
        按钮，选择“编辑本文”再次修改。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Check, CircleAlert, Command } from 'lucide-vue-next'

usePageTitle('首页')

const kurekoConfig = useKurekoConfig()
const user = useUserState()
const runtimeConfig = useRuntimeConfig()

const pbAdminUrl = new URL('/_/', runtimeConfig.public.pocketbaseUrl).toString()

const { content, error, html } = useContent(`type = "home"`)

async function createHomeDraft() {
  const pb = usePocketBase()
  const draft = await pb.collection('drafts').create({
    type: 'home',
    title: '@' + kurekoConfig.value?.author.name,
    slug: 'home',
  })
  await navigateTo('/editor/' + draft.id)
}

onMounted(() => postprocessContent('.prose'))
</script>
