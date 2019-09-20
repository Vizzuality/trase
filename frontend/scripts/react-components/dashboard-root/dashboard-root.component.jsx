import React from 'react';
import Card from 'react-components/shared/card/card.component';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';
import ShrinkingSpinner from 'scripts/react-components/shared/shrinking-spinner/shrinking-spinner.component';
import kebabCase from 'lodash/kebabCase';
import AnimatedFlows from 'react-components/animated-flows/animated-flows.component';

import 'scripts/react-components/dashboard-root/dashboard-root.scss';

function DashboardRoot(props) {
  const { dashboardTemplates, loadingDashboardTemplates } = props;
  const linkProps = {
    to: {
      type: 'dashboardElement',
      payload: {
        dashboardId: 'new',
        serializerParams: {
          selectedCountryId: null,
          selectedCommodityId: null,
          sources: [],
          companies: [],
          destinations: []
        }
      }
    },
    target: undefined,
    rel: undefined,
    'data-test': 'dashboard-root-create-button'
  };
  const getTemplateLink = template => ({
    to: {
      type: 'dashboardElement',
      payload: {
        dashboardId: kebabCase(template.title),
        serializerParams: {
          selectedCountryId: template.countries[0],
          selectedCommodityId: template.commodities[0],
          sources: template.sources,
          companies: template.companies,
          destinations: template.destinations
        }
      }
    },
    target: undefined,
    rel: undefined
  });

  return (
    <div className="l-dashboard-root">
      <AnimatedFlows />
      <div className="c-dashboard-root">
        <h2 className="dashboard-root-title">See how commodity trade impacts the world</h2>
        <section className="dashboard-root-grid">
          <div className="row">
            {loadingDashboardTemplates && (
              <div className="column small-12 medium-12 large-12">
                <ShrinkingSpinner className="-large -white" data-test="dashboard-root-spinner" />
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
                  testId="dashboard-root-card"
                />
              </div>
            )}
            {!loadingDashboardTemplates &&
              dashboardTemplates &&
              dashboardTemplates.map(template => (
                <div key={template.title} className="column small-12 medium-6 large-4">
                  <div className="post">
                    <Card
                      title={template.title}
                      subtitle={template.category}
                      imageUrl={API_V3_URL + template.imageUrl}
                      className="dashboard-root-item"
                      actionName="Go To Dashboard"
                      linkProps={getTemplateLink(template)}
                      Link={Link}
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
