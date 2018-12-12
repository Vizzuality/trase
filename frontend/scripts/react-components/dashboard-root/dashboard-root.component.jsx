import React from 'react';
import Card from 'react-components/shared/card/card.component';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import ShrinkingSpinner from 'scripts/react-components/shared/shrinking-spinner/shrinking-spinner.component';

import 'scripts/react-components/dashboard-root/dashboard-root.scss';

function DashboardRoot(props) {
  const { dashboardTemplates, loadingDashboardTemplates } = props;
  const linkProps = {
    to: { type: 'dashboardElement', payload: { dashboardId: 'new' } },
    target: undefined,
    rel: undefined
  };
  return (
    <div className="l-dashboard-root">
      <div className="c-dashboard-root">
        <h1 className="title is-hidden">See how commodity trade impacts the world</h1>
        <section className="dashboard-root-grid">
          <div className="row">
            {loadingDashboardTemplates && (
              <div className="column small-12 medium-12 large-12">
                <ShrinkingSpinner className="-large -white" />
              </div>
            )}
            {!loadingDashboardTemplates && (
              <div className="column small-12 medium-6 large-4">
                <Card
                  className="dashboard-create-card"
                  title="Create your own Dashboard with custom options."
                  subtitle="Custom dashboard"
                  actionName="Create dashboard"
                  variant="new"
                  Link={Link}
                  linkProps={linkProps}
                />
              </div>
            )}
            {!loadingDashboardTemplates &&
              dashboardTemplates &&
              dashboardTemplates.map(post => (
                <div key={post.title} className="column small-12 medium-6 large-4">
                  <div className="post">
                    <Card
                      title={post.title}
                      subtitle={post.category}
                      imageUrl={API_V3_URL + post.imageUrl}
                      className="dashboard-root-item"
                      actionName="Go To Dashboard"
                      linkUrl={post.completePostUrl}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

DashboardRoot.propTypes = {
  dashboardTemplates: PropTypes.array,
  loadingDashboardTemplates: PropTypes.bool
};

export default DashboardRoot;
