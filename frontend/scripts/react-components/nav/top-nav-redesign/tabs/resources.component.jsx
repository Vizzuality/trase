import React from 'react';

import Card from 'react-components/shared/card/card.component';

const Resources = ({ springStyles }) => (
  <div className="nav-tab-container -insights">
    <div style={springStyles} className="-navigation-block">
      <h5>Resources</h5>
      <ul>
        <li>
          <a href="#">Publications</a>
        </li>
        <li>
          <a href="#">Presentations</a>
        </li>
        <li>
          <a href="#">Tutorials</a>
        </li>
        <li>
          <a href="#">Methods</a>
        </li>
        <li>
          <a href="#">FAQs</a>
        </li>
      </ul>
    </div>
    <div style={springStyles} className="-tab-contents">
      <div className="tab-contents-cards">
        <Card title="Supply chain" variant="header-card" />
        <Card title="Finance" variant="header-card" />
        <Card title="Insights" variant="header-card" />
      </div>
    </div>
  </div>
);

Resources.propTypes = {
  springStyles: null
};

export default Resources;
