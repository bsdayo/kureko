<template>
  <div class="max-w-prose mx-auto py-16">
    <ContentHeader>
      <ContentTitle :pending="pending">
        <span v-if="error?.statusCode === 404">
          欢迎使用 <a class="underline" href="https://github.com/bsdayo/kureko">Kureko</a>！
        </span>
        <span v-else>{{ content?.title }}</span>
      </ContentTitle>
    </ContentHeader>

    <Separator class="my-8" />

    <div v-if="error?.statusCode === 404" class="prose dark:prose-invert">
      <p>这里的说明将指引你创建管理员账号，并编辑主页的内容。</p>

      <p>
        首先，你需要登录。
        <a class="cursor-pointer" @click="loginWithGitHub">点击此处使用 GitHub 登录</a>。
      </p>
      <div class="alert" data-type="info">
        <div class="alert-title">
          注意：此处的用户与 PocketBase 的超级用户（Superuser）并不相同。
        </div>
      </div>
      <div v-if="user" class="alert" data-type="success">
        <div class="alert-title">已登录为 {{ user.name }}。</div>
      </div>
      <div v-else class="alert" data-type="warning">
        <div class="alert-title">未登录。</div>
      </div>

      <p>
        登录后，<a :href="pbAdminUrl">前往 PocketBase 管理界面</a>，在
        <code>users</code> 集合中，将你账号的 <code>owner</code> 属性设置为 <code>true</code>。
      </p>
      <p>
        设置后，你需要<a class="cursor-pointer" @click="loginWithGitHub">重新登录</a>以更新状态。
      </p>
      <div v-if="user?.owner" class="alert" data-type="success">
        <div class="alert-title">当前登录用户已为管理员。</div>
      </div>
      <div v-else class="alert" data-type="warning">
        <div class="alert-title">当前登录用户不为管理员。</div>
      </div>

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
    <ContentContent :pending="pending" :html="html" />
  </div>
</template>

<script lang="ts" setup>
import { Check, CircleAlert, Command } from 'lucide-vue-next'

usePageTitle('首页')

const kurekoConfig = useKurekoConfig()
const user = useUserState()
const runtimeConfig = useRuntimeConfig()

const pbAdminUrl = new URL('/_/', runtimeConfig.public.pocketbaseUrl).toString()

const { content, pending, error, html } = useContent(`type = "home"`)

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
