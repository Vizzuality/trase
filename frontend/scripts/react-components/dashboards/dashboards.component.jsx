import React from 'react';
import Card from 'react-components/shared/card.component';
// import PropTypes from 'prop-types';
// import cx from 'classnames';

function Dashboards(props) {
  const { posts } = props;
  return (
    <div className="l-dashboards">
      <div className="c-dashboards">
        <h1 className="title">See how commodity trade impacts the world</h1>
        <section className="dashboards-grid">
          <div className="row">
            {posts.slice(0, 5).map(post => (
              <div className="column small-12 medium-6 large-4">
                <div className="post">
                  <Card
                    title={post.title}
                    subtitle={post.category}
                    imageUrl={post.imageUrl}
                    className="dashboard-item"
                    actionName="Go To Dashboard"
                    linkUrl={post.completePostUrl}
                  />
                </div>
              </div>
            ))}
            <div className="column small-12 medium-6 large-4">
              <Card
                className="-dashed"
                title="Create your own Dashboard with custom options."
                subtitle="Custom dashboard"
                actionName="Create dashboard"
                imageUrl="/images/logos/trase_logo_white.svg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Dashboards.propTypes = {};

export default Dashboards;
