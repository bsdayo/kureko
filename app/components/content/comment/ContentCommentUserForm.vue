<template>
  <form
    @submit="submit"
    class="overflow-hidden grid sm:grid-cols-[1fr_1fr_auto] gap-2 p-2 border-b items-start"
  >
    <div class="grid grid-cols-[auto_1fr] gap-2">
      <label class="content-center text-sm">
        <!-- <IdCard class="size-4" /> -->
        昵称
      </label>
      <Input v-model="name" v-bind="nameAttrs" :placeholder="user?.name" />
      <span v-if="errors.name" class="col-start-2 text-sm text-destructive">
        {{ errors.name }}
      </span>
    </div>

    <div class="grid grid-cols-[auto_1fr] gap-2">
      <label class="content-center text-sm">
        <!-- <Link class="size-4" /> -->
        网站
      </label>
      <Input v-model="website" v-bind="websiteAttrs" :placeholder="user?.website || '网站'" />
      <span v-if="errors.website" class="col-start-2 text-sm text-destructive">
        {{ errors.website }}
      </span>
    </div>

    <div class="flex gap-2">
      <Button type="submit" class="grow sm:size-9">
        <Check />
      </Button>
      <Button size="icon" variant="destructive" @click="logOut">
        <LogOut />
      </Button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { Check, IdCard, Link, LogOut } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'

const emit = defineEmits<{
  (e: 'logOut'): void
}>()

const pb = usePocketBase()
const user = useUserState()

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().nonempty(),
      website: z.string().url().optional().or(z.literal('')),
    })
  ),
})
const [name, nameAttrs] = defineField('name')
const [website, websiteAttrs] = defineField('website')
const submit = handleSubmit(async (values) => {
  if (!user.value) return
  const newUserInfo = await pb.collection('users').update(user.value?.id, {
    name: values.name,
    website: values.website || null,
  })
  toast.success('用户信息已更新。')
  user.value = newUserInfo
})

function logOut() {
  emit('logOut')
  pb.authStore.clear()
  toast.success('已登出。')
}
</script>
