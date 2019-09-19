import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import toLower from 'lodash/toLower';
import Tooltip from 'components/shared/info-tooltip.component';
import formatValue from 'utils/formatValue';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import Heading from 'react-components/shared/heading';
import SankeyColumn from './sankey-column.component';
import NodeMenu from './node-menu.component';
import SankeyLink from './sankey-link.component';
import * as Defs from './sankey-defs.component';

import 'react-components/tool/sankey/sankey.scss';

function useMenuOptions(props) {
  const { hasExpandedNodesIds, isReExpand, onExpandClick, onCollapseClick, onClearClick } = props;
  return useMemo(() => {
    const items = [
      { id: 'expand', label: isReExpand ? 'Re-Expand' : 'Expand', onClick: onExpandClick },
      { id: 'collapse', label: 'Collapse', onClick: onCollapseClick },
      { id: 'clear', label: 'Clear Selection', onClick: onClearClick }
    ];

    if (!isReExpand && hasExpandedNodesIds) {
      return items.filter(item => item.id !== 'expand');
    }
    if (!hasExpandedNodesIds) {
      return items.filter(item => item.id !== 'collapse');
    }

    return items;
  }, [hasExpandedNodesIds, isReExpand, onClearClick, onCollapseClick, onExpandClick]);
}

function useMenuPosition(props, columns) {
  const { selectedNodesIds, isReExpand } = props;
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!columns) {
      return;
    }
    // use some to stop iterating once its found
    columns.some(column =>
      column.values.some(node => {
        const last = selectedNodesIds.length - 1;
        if (node.id === selectedNodesIds[last]) {
          const x = node.x;
          const y = Math.max(0, node.y) - (ref.current?.scrollTop || 0);
          setMenuPos({ x, y });
          return true;
        }
        return false;
      })
    );
  }, [selectedNodesIds, columns, isReExpand]);

  return [menuPos, ref];
}

function useVanillaTooltip({ links }) {
  const ref = useRef(null);
  const tooltip = useRef(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!tooltip.current && ref.current) {
      tooltip.current = new Tooltip(ref.current);
    }

    if (tooltip.current) {
      if (content) {
        tooltip.current.show(
          content.x,
          content.y,
          content.title,
          content.values,
          content.height,
          content.width
        );
      } else {
        tooltip.current.hide();
      }

      if (!links) {
        tooltip.current.hide();
      }
    }

    return () => {
      if (tooltip.current) {
        tooltip.current.hide();
      }
    };
  }, [content, links]);

  return [ref, setContent];
}

function useDomNodeRect(input) {
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, [input]);

  return [rect, ref];
}

function useNodeRefHeight(ref) {
  const [height, setHeight] = useState(undefined);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, []);

  return height;
}

function Sankey(props) {
  const {
    columns,
    links,
    maxHeight,
    flowsLoading,
    sankeyColumnsWidth,
    selectedResizeBy,
    detailedView,
    selectedRecolorBy,
    onNodeClicked,
    highlightedNodeId,
    gapBetweenColumns,
    onNodeHighlighted,
    selectedNodesIds
  } = props;
  const [hoveredLink, setHoveredLink] = useState(null);
  const menuOptions = useMenuOptions(props);
  const [tooltipRef, setTooltip] = useVanillaTooltip(props);
  const [rect, svgRef] = useDomNodeRect(columns);
  const [menuPos, scrollContainerRef] = useMenuPosition(props, columns);
  const placeholderHeight = useNodeRefHeight(scrollContainerRef);

  const getLinkColor = link => {
    let classPath = 'sankey-link';
    if (selectedRecolorBy) {
      if (link.recolorBy === null) {
        return classPath;
      }
      let recolorBy = link.recolorBy;
      if (selectedRecolorBy.divisor) {
        recolorBy = Math.floor(link.recolorBy / selectedRecolorBy.divisor);
      }
      const legendTypeClass = toLower(selectedRecolorBy.legendType);
      const legendColorThemeClass = toLower(selectedRecolorBy.legendColorTheme);
      classPath = `${classPath} -recolorby-${legendTypeClass}-${legendColorThemeClass}-${recolorBy}`;
    } else {
      classPath = `${classPath} -recolorgroup-${link.recolorGroup}`;
    }

    return classPath;
  };

  const onLinkOver = (e, link) => {
    const tooltip = {
      title: `${link.sourceNodeName} > ${link.targetNodeName}`,
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
      height: rect.height,
      width: rect.width,
      values: [
        {
          title: selectedResizeBy.label,
          unit: selectedResizeBy.unit,
          value: formatValue(link.quant, selectedResizeBy.label)
        }
      ]
    };
    if (selectedRecolorBy) {
      let recolorValue = `${link.recolorBy}/${selectedRecolorBy.maxValue}`;
      if (link.recolorBy === null) {
        recolorValue = 'Unknown';
      } else if (selectedRecolorBy.type !== 'ind') {
        recolorValue = capitalize(startCase(link.recolorBy));
      } else if (selectedRecolorBy.legendType === 'percentual') {
        // percentual values are always a range, not the raw value.
        // The value coming from the model is already floored
        // to the start of the bucket (splitLinksByColumn)
        const nextValue = link.recolorBy + selectedRecolorBy.divisor;
        recolorValue = `${link.recolorBy}–${nextValue}%`;
      }
      tooltip.values.push({
        title: selectedRecolorBy.label,
        value: recolorValue
      });
    }

    setHoveredLink(link.id);
    setTooltip(tooltip);
  };

  const onLinkOut = () => {
    setHoveredLink(null);
    setTooltip(null);
  };

  const loading = !columns || columns.length === 0 || !links || flowsLoading;

  return (
    <div className="c-sankey is-absolute">
      <div
        ref={scrollContainerRef}
        className={cx('sankey-scroll-container', { '-detailed': detailedView })}
      >
        {loading && (
          <div
            className="sankey-loading"
            style={{ left: gapBetweenColumns + 2 * sankeyColumnsWidth + gapBetweenColumns / 2 }}
          >
            <Heading variant="mono" size="md" weight="bold">
              Loading
            </Heading>
          </div>
        )}
        <NodeMenu menuPos={menuPos} isVisible={selectedNodesIds.length > 0} options={menuOptions} />
        <div ref={tooltipRef} className="c-info-tooltip" />
        <svg
          ref={svgRef}
          className="sankey"
          style={{ height: detailedView ? `${maxHeight}px` : '100%' }}
        >
          <defs>
            <Defs.IsAggregate />
            <Defs.GradientAnimation
              selectedNodesIds={selectedNodesIds}
              selectedRecolorBy={selectedRecolorBy}
            />
          </defs>
          <g className="sankey-container">
            <g className="sankey-links">
              {!loading &&
                links.map(link => (
                  // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                  <SankeyLink
                    key={link.id}
                    link={link}
                    onMouseOut={onLinkOut}
                    onMouseOver={e => onLinkOver(e, link)}
                    className={cx(getLinkColor(link), { '-hover': hoveredLink === link.id })}
                  />
                ))}
              {loading && (
                <Defs.LinksPlaceHolder
                  height={placeholderHeight}
                  gapBetweenColumns={gapBetweenColumns}
                  sankeyColumnsWidth={sankeyColumnsWidth}
                />
              )}
            </g>
            <g className="sankey-columns">
              {!loading &&
                columns.map(column => (
                  <SankeyColumn
                    key={column.key}
                    column={column}
                    selectedNodesIds={selectedNodesIds}
                    onNodeClicked={onNodeClicked}
                    highlightedNodeId={highlightedNodeId}
                    onNodeHighlighted={onNodeHighlighted}
                    sankeyColumnsWidth={sankeyColumnsWidth}
                  />
                ))}
              {loading && (
                <Defs.ColumnsPlaceholder
                  height={placeholderHeight}
                  gapBetweenColumns={gapBetweenColumns}
                  sankeyColumnsWidth={sankeyColumnsWidth}
                />
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

Sankey.propTypes = {
  links: PropTypes.array,
  columns: PropTypes.array,
  maxHeight: PropTypes.number,
  detailedView: PropTypes.bool,
  flowsLoading: PropTypes.bool,
  isReExpand: PropTypes.bool, // eslint-disable-line
  hasExpandedNodesIds: PropTypes.bool, // eslint-disable-line
  selectedResizeBy: PropTypes.object,
  selectedRecolorBy: PropTypes.object,
  highlightedNodeId: PropTypes.number,
  gapBetweenColumns: PropTypes.number,
  onClearClick: PropTypes.func.isRequired, // eslint-disable-line
  onExpandClick: PropTypes.func.isRequired, // eslint-disable-line
  sankeyColumnsWidth: PropTypes.number.isRequired,
  onNodeClicked: PropTypes.func.isRequired,
  onCollapseClick: PropTypes.func.isRequired, // eslint-disable-line
  onNodeHighlighted: PropTypes.func.isRequired,
  selectedNodesIds: PropTypes.array.isRequired
};

export default Sankey;
