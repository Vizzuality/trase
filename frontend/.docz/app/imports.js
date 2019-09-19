export const imports = {
  'docs/accordion.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-accordion" */ 'docs/accordion.mdx'),
  'docs/buttons.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-buttons" */ 'docs/buttons.mdx'),
  'docs/cards.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-cards" */ 'docs/cards.mdx'),
  'docs/dashboard-widget.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-dashboard-widget" */ 'docs/dashboard-widget.mdx'),
  'docs/dropdown.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-dropdown" */ 'docs/dropdown.mdx'),
  'docs/lists.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-lists" */ 'docs/lists.mdx'),
  'docs/inputs.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-inputs" */ 'docs/inputs.mdx'),
  'docs/steps-tracker.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-steps-tracker" */ 'docs/steps-tracker.mdx'),
  'docs/tabs.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-tabs" */ 'docs/tabs.mdx'),
  'docs/texts.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "docs-texts" */ 'docs/texts.mdx'),
}
