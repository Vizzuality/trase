export const imports = {
  'docs/buttons.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-buttons" */ 'docs/buttons.mdx'),
  'docs/texts.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-texts" */ 'docs/texts.mdx'),
}
