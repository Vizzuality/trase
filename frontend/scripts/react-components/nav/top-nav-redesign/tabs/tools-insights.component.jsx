import React from 'react';

import Card from 'react-components/shared/card/card.component';

const ToolsInsights = () => (
  <div className="nav-tab-container -insights">
    <div className="-navigation-block">
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Supply Chain</a>
        </li>
        <li>
          <a href="#">Finance</a>
        </li>
        <li>
          <a href="#">Insights</a>
        </li>
      </ul>
      <span className="scroll-indicator">scroll</span>
    </div>
    <div className="-tab-contents">
      <div className="tab-contents-cards">
        <Card
          title="Supply chain"
          subtitle="Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. In ornare quam viverra orci…"
          imageUrl="images/landing-redesign/supply-chain-blue.png"
          variant="header-card"
        />
        <Card
          title="Finance"
          subtitle="Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. In ornare quam viverra orci…"
          imageUrl="images/landing-redesign/finance-blue.png"
          variant="header-card"
        />
        <Card
          title="Insights"
          subtitle="Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque. In ornare quam viverra orci…"
          imageUrl="images/landing-redesign/insights-blue.png"
          variant="header-card"
        />
      </div>
    </div>
  </div>
);

ToolsInsights.propTypes = {};

export default ToolsInsights;
