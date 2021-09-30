import React from 'react';

const SidebarNav = React.lazy(() => import('./sidebar-nav.container'));

export default function(Component) {
  function SidebarNavLayoutHOC() {
    return (
      <div className="row">
        <div className="column small-12 medium-4">
          <SidebarNav />
        </div>
        <article className="column small-12 medium-8 container">
          <Component />
        </article>
      </div>
    );
  }
  SidebarNavLayoutHOC.displayName = `SidebarNavLayoutHOC(${Component.displayName ||
    Component.name ||
    'Component'})`;
  return SidebarNavLayoutHOC;
}
