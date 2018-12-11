import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Toggle from 'react-components/shared/toggle.component';
import Text from 'react-components/shared/text.component';

import 'styles/components/logistics-map/logistics-map-legend.scss';
import Heading from 'react-components/shared/heading.component';

class LogisticsMapLegend extends React.PureComponent {
  state = {
    open: true
  };

  toggle = () => this.setState(state => ({ open: !state.open }));

  render() {
    const { open } = this.state;
    const { layers, setLayerActive } = this.props;
    return (
      <aside className={cx('c-logistics-map-legend', { '-closed': !open })}>
        <div className={cx(['logistics-map-legend-title', { '-closed': !open }])}>
          <button className="logistics-map-legend-toggle" onClick={this.toggle}>
            <Heading as="h3" size="rg" color="white">
              Soy Facilities
            </Heading>
          </button>
        </div>
        <ul className={cx(['logistics-map-legend-list', { '-closed': !open }])}>
          {layers.map(layer => (
            <li className="logistics-map-legend-list-item">
              <Text>{layer.name}</Text>
              <Toggle
                id={layer.id}
                checked={layer.active}
                onChange={e => setLayerActive(layer.id, e.target.checked)}
              />
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}

LogisticsMapLegend.propTypes = {
  layers: PropTypes.array,
  setLayerActive: PropTypes.func
};

export default LogisticsMapLegend;
