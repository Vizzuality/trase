import React from 'react';
import PropTypes from 'prop-types';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import cx from 'classnames';
import Top from 'react-components/profiles/top.component';

class Explore extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const { year } = this.props;
    if (prevProps.year !== year) {
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
              <div className="explore-map-container">
                <WorldMap className="explore-world-map" />
              </div>
            </div>
            {showTable && (
              <div className="column medium-5">
                <div className="explore-table-container">
                  <Top
                    unit="tn"
                    targetLink="profileActor"
                    title="Top Exporting Companies"
                    year={year}
                    data={topExporters}
                  />
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
  showTable: PropTypes.bool.isRequired,
  topExporters: PropTypes.array.isRequired,
  year: PropTypes.number,
  getTopExporters: PropTypes.func.isRequired
};

export default Explore;
