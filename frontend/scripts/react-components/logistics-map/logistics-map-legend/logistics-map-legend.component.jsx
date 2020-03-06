import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import Text from 'react-components/shared/text/text.component';
import Heading from 'react-components/shared/heading/heading.component';
import Toggle from 'react-components/shared/toggle/toggle.component';
import Tooltip from 'react-components/shared/help-tooltip/help-tooltip.component';

import './logistics-map-legend.scss';

class LogisticsMapLegend extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    heading: PropTypes.string,
    tooltips: PropTypes.object,
    setLayerActive: PropTypes.func
  };

  state = {
    open: true
  };

  toggle = () => this.setState(state => ({ open: !state.open }));

  render() {
    const { open } = this.state;
    const { layers, setLayerActive, heading, tooltips } = this.props;
    return (
      <aside className={cx('c-logistics-map-legend', { '-closed': !open })}>
        <div className={cx(['logistics-map-legend-title', { '-closed': !open }])}>
          <button className="logistics-map-legend-toggle" onClick={this.toggle}>
            <Heading as="h3" size="rg" color="white">
              {heading}
            </Heading>
          </button>
        </div>
        <ul className={cx(['logistics-map-legend-list', { '-closed': !open }])}>
          {layers.map(layer => (
            <li className="logistics-map-legend-list-item" key={layer.id}>
              <Text>{capitalize(layer.name)}</Text>
              <div className="logistics-map-legend-item-controls">
                <Toggle
                  id={layer.id}
                  color={layer.color}
                  checked={layer.active}
                  onChange={e => setLayerActive(layer.id, e.target.checked)}
                />
                {tooltips && tooltips[layer.id] && (
                  <Tooltip text={tooltips[layer.id]} className="size-rg" interactive />
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}

export default LogisticsMapLegend;
