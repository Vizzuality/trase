import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import NodeTitle from 'react-components/shared/node-title/node-title.component';
import ClearSelectionButton from 'react-components/shared/clear-selection-button/clear-selection-button.component';

import 'react-components/logistics-map/logistics-map-bar/logistics-map-bar.scss';

function LogisticsMapBar(props) {
  const { clearItems, openModal, removeItem, activeItems } = props;
  return (
    <div className="c-logistics-map-bar">
      <Button className="logistics-map-bar-browse" size="sm" onClick={openModal} color="charcoal">
        Browse companies
      </Button>
      {activeItems.length > 0 && (
        <div className="logistics-map-bar-wrapper">
          <div className="logistics-map-bar-item-container">
            {activeItems.map(company => (
              <NodeTitle
                key={company}
                className="logistics-map-bar-item"
                columns={[{ content: company }]}
                onClose={() => removeItem(company)}
              />
            ))}
          </div>
          <div className="logistics-map-bar-clear-container">
            <ClearSelectionButton onClick={clearItems} />
          </div>
        </div>
      )}
    </div>
  );
}

LogisticsMapBar.propTypes = {
  clearItems: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  activeItems: PropTypes.array.isRequired
};

export default LogisticsMapBar;
