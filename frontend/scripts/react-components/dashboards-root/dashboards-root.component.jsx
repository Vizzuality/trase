import React from 'react';
import Card from 'react-components/shared/card.component';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
// import cx from 'classnames';

function DashboardsRoot(props) {
  const { posts } = props;
  const linkProps = {
    to: { type: 'dashboardsElement', payload: { dashboardId: 'new' } },
    target: undefined,
    rel: undefined
  };
  return (
    <div className="l-dashboards-root">
      <div className="c-dashboards-root">
        <h1 className="title">See how commodity trade impacts the world</h1>
        <section className="dashboards-root-grid">
          <div className="row">
            <div className="column small-12 medium-6 large-4">
              <Card
                className="dashboards-create-card"
                title="Create your own Dashboard with custom options."
                subtitle="Custom dashboard"
                actionName="Create dashboard"
                variant="new"
                Link={Link}
                linkProps={linkProps}
              />
            </div>
            {posts.slice(0, 5).map(post => (
              <div key={post.title} className="column small-12 medium-6 large-4">
                <div className="post">
                  <Card
                    title={post.title}
                    subtitle={post.category}
                    imageUrl={post.imageUrl}
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

DashboardsRoot.propTypes = {
  posts: PropTypes.any
};

export default DashboardsRoot;
