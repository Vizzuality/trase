import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import Top from 'react-components/profiles/top.component';

class Explore extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const { topNodesKey } = this.props;
    if (topNodesKey && prevProps.topNodesKey !== topNodesKey) {
      this.props.getTopExporters();
    }
  }

  render() {
    const { showTable, topExporters, year } = this.props;
    return (
      <div className="l-explore">
        <div className="c-explore">
          <div className="row">
            <div className={cx('column', 'small-12', { 'medium-7': showTable })}>
              <div className="explore-section">
                <div className="explore-map-wrapper">
                  <h2 className={cx('subtitle', '-dark', { 'is-hidden': !showTable })}>
                    Top Destinations
                  </h2>
                  <div className={cx('explore-map-container', { '-small': showTable })}>
                    <WorldMap className="explore-world-map" />
                  </div>
                </div>
                <p className={cx('explore-footer-text', { 'is-hidden': !showTable })}>
                  By accessing the Trase platform you have acknowledged and agreed to our{' '}
                  <Link to={{ type: 'about', payload: { section: 'termsOfUse' } }}>
                    Terms of Use.
                  </Link>
                </p>
              </div>
            </div>
            {showTable && (
              <div className="column medium-5">
                <div className="explore-section">
                  <div className="explore-table-container">
                    <Top
                      unit="%"
                      valueProp="height"
                      targetLink="profileActor"
                      title="Top Exporting Companies"
                      year={year}
                      data={topExporters}
                    />
                  </div>
                  <Link className="c-button -pink -big explore-footer-button" to={{ type: 'tool' }}>
                    Explore the subnational supply chain
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Explore.propTypes = {
  topNodesKey: PropTypes.string,
  showTable: PropTypes.bool.isRequired,
  topExporters: PropTypes.array.isRequired,
  year: PropTypes.number,
  getTopExporters: PropTypes.func.isRequired
};

export default Explore;
