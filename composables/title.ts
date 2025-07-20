export function usePageTitle(title: MaybeRefOrGetter<string | undefined>) {
  const config = useKurekoConfig()
  useHead({
    title,
    titleTemplate: computed(() => config.value?.site.titleTemplate ?? '%s'),
  })
}
