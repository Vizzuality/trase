import React from 'react';

import Card from 'react-components/shared/card/card.component';

const ToolsInsights = () => (
  <div className="nav-tab-container -insights">
    <div className="-navigation-block">
      <p className="nav-tab-hero">
        <span>Reveal.</span> <span>Target.</span> <span>Enable.</span> <span>Transform.</span>
      </p>
      <span className="scroll-indicator">scroll</span>
    </div>
    <div className="-tab-contents">
      <div className="tab-contents-cards">
        <Card title="Supply chain" variant="header-card" />
        <Card title="Finance" variant="header-card" />
        <Card title="Insights" variant="header-card" />
      </div>
    </div>
  </div>
);

export default ToolsInsights;
