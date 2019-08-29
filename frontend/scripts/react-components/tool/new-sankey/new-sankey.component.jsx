import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import toLower from 'lodash/toLower';
import Tooltip from 'components/shared/info-tooltip.component';
import formatValue from 'utils/formatValue';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import SankeyColumn from 'react-components/tool/new-sankey/sankey-column.component';
import NodeMenu from './node-menu.component';
import SankeyLink from './sankey-link.component';

import 'styles/components/tool/sankey.scss';

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
  const { selectedNodesIds } = props;
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
  }, [selectedNodesIds, columns]);

  return [menuPos, ref];
}

function useVanillaTooltip() {
  const ref = useRef(null);
  const tooltip = useRef(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!tooltip.current && ref.current) {
      tooltip.current = new Tooltip(ref.current);
    }

    if (tooltip.current) {
      if (content) {
        tooltip.current.show(content.x, content.y, content.title, content.values);
      } else {
        tooltip.current.hide();
      }
    }
  }, [content]);

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

function NewSankey(props) {
  const {
    columns,
    links,
    maxHeight,
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
  const [tooltipRef, setTooltip] = useVanillaTooltip();

  const [rect, svgRef] = useDomNodeRect(columns);

  const [menuPos, scrollContainerRef] = useMenuPosition(props, columns);

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
      }
      if (selectedRecolorBy.type !== 'ind') {
        recolorValue = capitalize(startCase(link.recolorBy));
      }
      if (selectedRecolorBy.legendType === 'percentual') {
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

  const stops = {
    default: [
      { color: '#28343b', opacity: 0.4 },
      { color: '#28343b', opacity: 0.2 },
      { color: '#28343b', opacity: 0.1 },
      { color: '#28343b', opacity: 0.1 },
      { color: '#28343b', opacity: 0.1 },
      { color: '#28343b', opacity: 0.2 },
      { color: '#28343b', opacity: 0.4 }
    ],
    selection: [
      { color: '#ea6869', opacity: 0.5 },
      { color: '#ffeb8b', opacity: 0.5 },
      { color: '#2d586e', opacity: 0.5 },
      { color: '#b4008a', opacity: 0.5 },
      { color: '#2d586e', opacity: 0.5 },
      { color: '#ffeb8b', opacity: 0.5 },
      { color: '#ea6869', opacity: 0.5 }
    ],
    biome: [
      { color: '#43f3f3', opacity: 0.5 },
      { color: '#517fee', opacity: 0.5 },
      { color: '#8c28ff', opacity: 0.5 },
      { color: '#ff66e5', opacity: 0.5 },
      { color: '#72ea28', opacity: 0.5 },
      { color: '#ffb314', opacity: 0.5 }
    ]
  };

  let selectedColor = selectedNodesIds.length > 0 ? 'selection' : 'default';
  if (selectedRecolorBy) {
    selectedColor = 'biome';
  }

  return (
    <div className="c-sankey is-absolute">
      <div
        ref={scrollContainerRef}
        className={cx('sankey-scroll-container', { '-detailed': detailedView })}
      >
        <NodeMenu menuPos={menuPos} isVisible={selectedNodesIds.length > 0} options={menuOptions} />
        <div ref={tooltipRef} className="c-info-tooltip" />
        <svg
          ref={svgRef}
          className="sankey"
          style={{ height: detailedView ? `${maxHeight}px` : '100%' }}
        >
          <defs>
            <pattern
              id="isAggregatedPattern"
              x="0"
              y="0"
              width="1"
              height="3"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="50" height="1" fill="#ddd" />
              <rect x="0" y="1" width="50" height="2" fill="#fff" />
            </pattern>
            <linearGradient
              id="animate-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0"
              spreadMethod="reflect"
            >
              {stops[selectedColor].map((stop, i) => (
                <stop offset={i} stopColor={stop.color} stopOpacity={stop.opacity} />
              ))}
              <animate
                id="one"
                attributeName="x1"
                values="0%;120%"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                id="two"
                attributeName="x2"
                values="100%;200%"
                dur="4s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <g className="sankey-container">
            <g className="sankey-links">
              {links?.map(link => (
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                <SankeyLink
                  key={link.id}
                  link={link}
                  onMouseOut={onLinkOut}
                  onMouseOver={e => onLinkOver(e, link)}
                  className={cx(getLinkColor(link), { '-hover': hoveredLink === link.id })}
                />
              ))}
              {!links &&
                Array.from({ length: 3 }).map((_, i) => (
                  <rect
                    key={i}
                    height={575}
                    width={gapBetweenColumns}
                    transform={`translate(${i * gapBetweenColumns +
                      i * sankeyColumnsWidth +
                      sankeyColumnsWidth},0)`}
                    fill="url(#animate-gradient)"
                  />
                ))}
            </g>
            <g className="sankey-columns">
              {columns?.map(column => (
                <SankeyColumn
                  column={column}
                  selectedNodesIds={selectedNodesIds}
                  onNodeClicked={onNodeClicked}
                  highlightedNodeId={highlightedNodeId}
                  onNodeHighlighted={onNodeHighlighted}
                  sankeyColumnsWidth={sankeyColumnsWidth}
                />
              ))}
              {(!columns || columns.length === 0) &&
                Array.from({ length: 4 }).map((_, i) => (
                  <rect
                    key={i}
                    height={575}
                    width={sankeyColumnsWidth}
                    className="sankey-column-placeholder"
                    transform={`translate(${i * (sankeyColumnsWidth + gapBetweenColumns)},0)`}
                  />
                ))}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

NewSankey.propTypes = {
  links: PropTypes.array,
  columns: PropTypes.array,
  maxHeight: PropTypes.number,
  detailedView: PropTypes.bool,
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

export default NewSankey;
