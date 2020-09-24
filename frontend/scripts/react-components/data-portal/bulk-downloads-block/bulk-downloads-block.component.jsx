import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import { FixedSizeGrid } from 'react-window';
import debounce from 'lodash/debounce';
import Tabs from 'react-components/shared/tabs';
import cx from 'classnames';

import 'scripts/react-components/data-portal/bulk-downloads-block/bulk-downloads.scss';

function BulkDownloadsBlock(props) {
  const { contexts, enabled, onButtonClicked, bulkLogisticsData } = props;

  const [windowWidth, setWidth] = useState(window.innerWidth);
  const tabs = ['BULK SUPPLY CHAIN DATA', 'BULK LOGISTICS DATA'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  useEffect(() => {
    const debouncedSetWidth = debounce(() => setWidth(window.innerWidth), 700);
    window.addEventListener('resize', debouncedSetWidth);
    return () => {
      window.removeEventListener('resize', debouncedSetWidth);
    };
  }, []);

  const LARGE = 1078;
  const columnCount = windowWidth > LARGE ? 3 : 2;
  const rowHeight = 58;
  const columnWidth = 346;
  const width = windowWidth > LARGE ? 1040 : 695;
  const rowCount = Math.ceil(contexts.length / columnCount);

  function onBulkDownloadButtonClicked(type, id) {
    if (!enabled) return;
    onButtonClicked(type, id);
  }

  return (
    <div className="c-bulk-downloads">
      <Tabs tabs={tabs} onSelectTab={setSelectedTab} selectedTab={selectedTab}>
        <div className="bulk-download-grid">
          <FixedSizeGrid
            height={150}
            width={width}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            itemData={selectedTab === tabs[0] ? contexts : bulkLogisticsData}
            rowCount={rowCount}
            columnCount={columnCount}
            outerElementType={p => <div {...p} className="bulk-download-grid-outer-element" />}
          >
            {({ rowIndex, columnIndex, style, data }) => {
              const item = data[rowIndex * columnCount + columnIndex];
              if (typeof item === 'undefined') return null;
              return (
                <div
                  style={style}
                  className={cx('bulk-download-item-container', { '-small': columnCount === 2 })}
                >
                  <Button
                    color="charcoal-transparent"
                    size="lg"
                    disabled={!enabled}
                    className="bulk-download-item"
                    icon="icon-download"
                    onClick={() => onBulkDownloadButtonClicked(selectedTab === tabs[0] ? 'bulk' : 'logistics', item.id)}
                  >
                    {selectedTab === tabs[0]
                      ? `${item.countryName} - ${item.commodityName} (all years)`
                      : `${item.countryName} - ${item.commodityName} (${item.name})`}
                  </Button>
                </div>
              );
            }}
          </FixedSizeGrid>
          <div className="bulk-download-gradient" />
        </div>
      </Tabs>
    </div>
  );
}

BulkDownloadsBlock.propTypes = {
  contexts: PropTypes.array,
  bulkLogisticsData: PropTypes.array,
  enabled: PropTypes.bool,
  onButtonClicked: PropTypes.func
};

export default BulkDownloadsBlock;
