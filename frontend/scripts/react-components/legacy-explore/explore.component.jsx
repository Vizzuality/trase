import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import formatValue from 'utils/formatValue';
import WorldMap from 'react-components/shared/world-map/world-map.container';
import Top from 'react-components/shared/top';
import Dropdown from 'react-components/shared/dropdown';
import SentenceSelector from 'react-components/shared/sentence-selector/sentence-selector.container';
import Button from 'react-components/shared/button/button.component';
import Heading from 'react-components/shared/heading/heading.component';
import Text from 'react-components/shared/text/text.component';
import { EXPLORE_COLUMN_LIST, TOOL_LAYOUT } from 'constants';

import 'scripts/react-components/legacy-explore/explore.scss';

function Explore(props) {
  const {
    loading,
    topNodesKey,
    topExporters,
    redirectQuery,
    selectedYears,
    getTableElements,
    selectedTableColumnType,
    setSelectedTableColumnType,
    selectedContext,
    destinationCountries
  } = props;

  useEffect(() => {
    if (!destinationCountries) getTableElements('country');
  }, [destinationCountries, getTableElements]);

  useEffect(() => {
    if (topNodesKey) {
      getTableElements(selectedTableColumnType);
    }
  }, [topNodesKey, selectedTableColumnType, getTableElements]);

  const units = useRef([
    {
      label: '%',
      value: '%',
      format: item => formatValue(item.height * 100, 'percentage')
    },
    {
      label: 't',
      value: 't',
      format: item => formatValue(item.value, 'tons')
    }
  ]);

  const [selectedTableUnit, setSelectedTableUnit] = useState(units.current[0]);

  const handleTableColumnChange = useCallback(column => setSelectedTableColumnType(column.value), [
    setSelectedTableColumnType
  ]);

  const handleTableUnitChange = useCallback(
    unit => setSelectedTableUnit(units.current.find(u => u.value === unit.value)),
    [setSelectedTableUnit]
  );

  const handleFallbackClick = useCallback(() => {
    const [column] = EXPLORE_COLUMN_LIST.filter(item => item.value !== selectedTableColumnType);
    handleTableColumnChange(column);
  }, [selectedTableColumnType, handleTableColumnChange]);

  function getCallToAction(query) {
    if (query && query.toolLayout && JSON.parse(query.toolLayout) === TOOL_LAYOUT.left) {
      return 'Explore the map';
    }
    return 'Explore the supply chain';
  }

  function renderTableColumnDropdown() {
    const column = EXPLORE_COLUMN_LIST.find(item => item.value === selectedTableColumnType);

    return (
      <Dropdown
        size="sm"
        variant="mono"
        transform="uppercase"
        initialValue={column}
        options={EXPLORE_COLUMN_LIST}
        onChange={handleTableColumnChange}
      />
    );
  }

  function renderTableUnitDropdown() {
    return (
      <Dropdown
        size="sm"
        transform="uppercase"
        initialValue={selectedTableUnit}
        options={units.current}
        onChange={handleTableUnitChange}
      />
    );
  }

  function renderTableFallback() {
    const column = EXPLORE_COLUMN_LIST.find(item => item.type === selectedTableColumnType);
    const [alternativeColumn] = EXPLORE_COLUMN_LIST.filter(
      item => item.type !== selectedTableColumnType
    );
    return (
      <div className="explore-table-fallback">
        <p className="explore-table-fallback-text">
          100% of {column.fallbackText} are unknown, explore{' '}
        </p>
        <button
          type="button"
          onClick={handleFallbackClick}
          className="explore-table-fallback-button"
        >
          {alternativeColumn.label.toLowerCase()}.
        </button>
      </div>
    );
  }

  return (
    <div className="l-explore">
      <div className="c-legacy-explore">
        <div className="row sentence-selector-container">
          <div className="column small-12">
            <SentenceSelector />
          </div>
        </div>
        <div className="row">
          <div className={cx('column', 'medium-7')}>
            <div className="explore-section">
              <div className="explore-map-wrapper">
                <Heading variant="mono" size="sm" weight="bold">
                  Top Destinations
                </Heading>
                <div
                  className={cx('explore-map-container', { '-loading': loading && !topNodesKey })}
                >
                  <WorldMap
                    id="legacy-explore"
                    className="explore-world-map"
                    context={selectedContext}
                    destinationCountries={destinationCountries}
                    scale={120}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="column small-12 medium-5">
            <div className="explore-section -right">
              <div className="explore-table-container">
                <div className="explore-table-header">
                  {renderTableColumnDropdown()}
                  {renderTableUnitDropdown()}
                </div>
                <Top
                  unit={selectedTableUnit}
                  year={selectedYears[0]}
                  data={topExporters}
                  loading={!!loading}
                />
                {!loading && topExporters.length === 0 && renderTableFallback()}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-7 small-order-2 medium-order-1">
            <p className="explore-footer-text">
              By accessing the Trase platform you have acknowledged and agreed to our{' '}
              <a
                href="https://www.trase.earth/terms-of-use"
                title="https://www.trase.earth/terms-of-use"
              >
                Terms of Use.
              </a>
            </p>
          </div>
          <div className="column small-12 medium-5 small-order-1 medium-order-2 explore-footer-button-container">
            <div className="explore-footer-fake-button">
              <Text as="span" variant="mono">
                Visit trase on a computer to explore the full supply chain
              </Text>
            </div>
            <Button
              as={Link}
              color="pink"
              size="lg"
              className="explore-link-to-tool"
              to={{ type: 'tool', payload: redirectQuery && { serializerParams: redirectQuery } }}
            >
              {getCallToAction(redirectQuery)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

Explore.propTypes = {
  loading: PropTypes.bool,
  topNodesKey: PropTypes.string,
  redirectQuery: PropTypes.object,
  topExporters: PropTypes.array.isRequired,
  getTableElements: PropTypes.func.isRequired,
  selectedYears: PropTypes.arrayOf(PropTypes.number),
  selectedTableColumnType: PropTypes.string.isRequired,
  setSelectedTableColumnType: PropTypes.func.isRequired,
  selectedContext: PropTypes.object,
  destinationCountries: PropTypes.array
};

export default Explore;
