export const imports = {
  'docs/buttons.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-buttons" */ 'docs/buttons.mdx'),
  'docs/cards.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-cards" */ 'docs/cards.mdx'),
  'docs/lists.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-lists" */ 'docs/lists.mdx'),
  'docs/texts.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-texts" */ 'docs/texts.mdx'),
}
