export interface KurekoConfig {
  site: {
    titleTemplate: string
  }
  author: {
    name: string
    bio: string
    email: string
    avatarUrl: string
    social: KurekoAuthorSocialItem[]
  }
  footer: {
    years: string
    icp?: {
      enabled: boolean
      text: string
      link?: string
    }
  }
}

export interface KurekoAuthorSocialItem {
  type: 'email' | 'github' | 'steam' | 'bilibili' | 'neteaseCloudMusic' | 'custom'
  link: string
  iconUrl?: string
  iconHtml?: string
  fg?: string
  bg?: string
}

export function useKurekoConfig() {
  const pb = usePocketBase()
  const { data } = useAsyncData('kurekoConfig', () => {
    return pb.send<KurekoConfig>('/api/config', {
      method: 'GET',
    })
  })
  return data
}
