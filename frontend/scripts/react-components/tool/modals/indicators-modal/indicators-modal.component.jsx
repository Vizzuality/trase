import React from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';

import 'react-components/tool/modals/indicators-modal/indicators-modal.scss';

export default function IndicatorsModal({ items }) {
  return (
    <div className="c-indicators-modal">
      <div className="row columns">
        <Heading size="md" className="modal-title">
          Choose one indicator
          <GridList
            className="companies-panel-pill-list"
            items={items}
            height={items.length > 3 ? 200 : 50}
            width={700}
            rowHeight={50}
            columnWidth={190}
            columnCount={3}
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                // isActive={activeCompanies.includes(itemProps.item?.id)}
                // enableItem={onSelectCompany}
                // disableItem={onSelectCompany}
              />
            )}
          </GridList>
        </Heading>
      </div>
    </div>
  );
}

IndicatorsModal.propTypes = {
  items: PropTypes.array
};
