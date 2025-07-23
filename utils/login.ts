import { toast } from 'vue-sonner'

export async function loginWithGitHub() {
  const pb = usePocketBase()
  try {
    const user = await pb.collection('users').authWithOAuth2({
      provider: 'github',
    })
    toast.success(`欢迎回来，${user?.record.name}。`)
  } catch (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : '登录失败！')
  }
}
