import React from 'react';
// import PropTypes from 'prop-types';
// import cx from 'classnames';

function DashboardsElement() {
  return (
    <div className="l-dashboards-element">
      <div className="c-dashboards-element">
        <div className="row column">
          <h2 className="dashboard-element-title">Dashboard</h2>
        </div>
        <section className="dashboards-element-placeholder">
          <div className="row">
            {Array.from({ length: 6 }).map(() => (
              <div className="column small-12 medium-6">
                <b className="dashboards-element-placeholder-item" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

DashboardsElement.propTypes = {};

export default DashboardsElement;
