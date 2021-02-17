import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { TOOL_LAYOUT } from 'constants';

import LinkButton from 'react-components/shared/link-button.component';
import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';
import Button from 'react-components/shared/button/button.component';

function ToolSearchResult(props) {
  const {
    style,
    value,
    onClickAdd,
    selected,
    exporterNotSelected,
    importerNotSelected,
    itemProps,
    isHighlighted,
    item,
    contextId,
    toolLayout
  } = props;
  const buttonList = [];

  if (selected) {
    buttonList.push(
      <Button key="alreadyInSupplyChain" size="rg" disabled>
        Already in {toolLayout === TOOL_LAYOUT.left ? 'map' : 'supply chain'}
      </Button>
    );
  }

  if (!(exporterNotSelected && !importerNotSelected)) {
    if (exporterNotSelected) {
      buttonList.push(
        <Button key="addAsExporter" onClick={e => onClickAdd(e, item.exporter)} size="rg">
          Add as exporter
        </Button>
      );
    }

    if (importerNotSelected) {
      buttonList.push(
        <Button key="addAsImporter" onClick={e => onClickAdd(e, item.importer)} size="rg">
          Add as importer
        </Button>
      );
    }
  }

  return (
    <li
      {...itemProps}
      style={style}
      className={cx('c-search-result', { '-highlighted': isHighlighted })}
    >
      <div className="search-node-text-container">
        <span className="search-node-type">{item.nodeType}</span>
        <span className="search-node-name">
          <HighlightTextFragments text={item.name} highlight={value} />
        </span>
      </div>
      <div className="search-node-actions-container">
        {buttonList}
        {item.profile &&
          !DISABLE_PROFILES &&
          !(item.nodeType === 'COUNTRY' && !ENABLE_COUNTRY_PROFILES) &&
          item.nodeType.split(' & ').map(nodeType => (
            <LinkButton
              className="-medium-large"
              key={item.name + nodeType}
              to={{
                type: 'profile',
                payload: {
                  profileType: item.profile,
                  query: {
                    contextId,
                    nodeId: (item[nodeType.toLowerCase()] || item).id
                  }
                }
              }}
            >
              {nodeType} profile
            </LinkButton>
          ))}
      </div>
    </li>
  );
}

ToolSearchResult.propTypes = {
  style: PropTypes.object,
  item: PropTypes.object,
  value: PropTypes.string,
  selected: PropTypes.bool,
  onClickAdd: PropTypes.func,
  itemProps: PropTypes.object,
  toolLayout: PropTypes.number,
  isHighlighted: PropTypes.bool,
  exporterNotSelected: PropTypes.bool,
  importerNotSelected: PropTypes.bool,
  contextId: PropTypes.number.isRequired
};

export default ToolSearchResult;
