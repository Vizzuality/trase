import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { TOOL_LAYOUT } from 'constants';

import LinkButton from 'react-components/shared/link-button.component';
import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';
import Button from 'react-components/shared/button/button.component';

function ToolSearchResult({
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
}) {
  const buttonList = [];

  if (selected) {
    buttonList.push(
      <Button key="alreadyInSupplyChain" size="rg" disabled>
        Already in {toolLayout === TOOL_LAYOUT.left ? 'map' : 'supply chain'}
      </Button>
    );
  } else if (exporterNotSelected === importerNotSelected) {
    // The weird "if" above means that we only do NOT show this button if
    // node is both importer and exporter, and is added as one of them but no the other to the supply chain.
    // The "if" statement above that ensures it's also not shown if node is both and is selected
    // Commented out to hide the "add to supply chain"/"add to map" button
    // buttonList.push(
    //   <Button
    //     key="addToSupplyChain"
    //     size="rg"
    //     onClick={e => onClickAdd(e, item)}
    //   >
    //     Add to {toolLayout === TOOL_LAYOUT.left ? 'map' : 'supply chain'}
    //   </Button>
    // );
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
    <li {...itemProps} className={cx('c-search-result', { '-highlighted': isHighlighted })}>
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
          item.nodeType.split(' & ').map(nodeType => (
            <LinkButton
              className="-medium-large"
              key={item.name + nodeType}
              to={{
                type: 'profileNode',
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
