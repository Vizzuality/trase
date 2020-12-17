import React from 'react';

import Card from 'react-components/shared/card/card.component';

const About = ({ styles }) => (
  <div className="nav-tab-container -insights">
    <div style={styles} className="-navigation-block">
      <h5>About</h5>
      <ul>
        <li>
          <a href="#">What is trase?</a>
        </li>
        <li>
          <a href="#">Who is it for?</a>
        </li>
        <li>
          <a href="#">Team</a>
        </li>
        <li>
          <a href="#">Partners</a>
        </li>
        <li>
          <a href="#">Press Center</a>
        </li>
        <li>
          <a href="#">News</a>
        </li>
      </ul>
    </div>
    <div style={styles} className="-tab-contents">
      <div className="tab-contents-cards">
        <Card title="Supply chain" variant="header-card" />
        <Card title="Finance" variant="header-card" />
        <Card title="Insights" variant="header-card" />
      </div>
    </div>
  </div>
);

About.propTypes = {
  styles: {}
};

export default About;
