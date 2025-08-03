export function usePageTitle(title: MaybeRefOrGetter<string | undefined>) {
  const config = useKurekoConfig()
  useHead({
    title,
    titleTemplate: computed(() => `%s - ${config.value?.site.name}`),
  })
}
