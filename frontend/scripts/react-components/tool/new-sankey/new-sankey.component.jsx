import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import sankeyLayout from 'react-components/tool/sankey/sankey.d3layout';
import cx from 'classnames';
import 'styles/components/tool/sankey.scss';
import { DETAILED_VIEW_MIN_LINK_HEIGHT } from 'constants';
import toLower from 'lodash/toLower';
import Tooltip from 'components/shared/info-tooltip.component';
import formatValue from 'utils/formatValue';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import NodeMenu from './node-menu.component';

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

function useMenuPosition(props, columns, isReady) {
  const { selectedNodesIds, links } = props;
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!isReady) {
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
  }, [selectedNodesIds, links, isReady, columns]);

  return [menuPos, ref];
}

function useSankeyLayout(props) {
  const layout = useRef(sankeyLayout().columnWidth(100));
  const [isReady, setIsReady] = useState(false);
  const { selectedRecolorBy, links, sankeySize } = props;
  useEffect(() => {
    if (links === null || !sankeySize) {
      return;
    }
    layout.current.setViewportSize(sankeySize);
    layout.current.setLinksPayload(props);
    layout.current.relayout();

    if (layout.current.columns() && layout.current.columns().length > 0) {
      setIsReady(true);
    }
  }, [links, props, sankeySize, selectedRecolorBy]);
  return [isReady, layout];
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
    selectedResizeBy,
    detailedView,
    selectedRecolorBy,
    onNodeClicked,
    highlightedNodeId,
    onNodeHighlighted,
    selectedNodesIds
  } = props;
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isReady, layout] = useSankeyLayout(props);
  const menuOptions = useMenuOptions(props);
  const [tooltipRef, setTooltip] = useVanillaTooltip();
  const [rect, svgRef] = useDomNodeRect(isReady);

  const columns = layout.current.columns();
  const linksData = layout.current.links();

  const [menuPos, scrollContainerRef] = useMenuPosition(props, columns, isReady);

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

  if (!isReady) {
    return null;
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
          height={detailedView ? `${layout.current.getMaxHeight()}px` : '100%'}
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
          </defs>
          <g className="sankey-container">
            <g className="sankey-links">
              {linksData.map(link => (
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                <path
                  key={link.id}
                  id={link.id}
                  onMouseOver={e => onLinkOver(e, link)}
                  strokeWidth={Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, link.renderedHeight)}
                  className={cx(getLinkColor(link), { '-hover': hoveredLink === link.id })}
                  d={layout.current.link()(link)}
                  onMouseOut={onLinkOut}
                />
              ))}
            </g>
            <g className="sankey-columns">
              {columns.map(column => (
                <g
                  key={column.key}
                  className="sankey-column"
                  transform={`translate(${column.x},0)`}
                >
                  <g className="sankey-nodes">
                    {column.values.map((node, i, list) => (
                      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                      <g
                        key={node.id}
                        className={cx('sankey-node', {
                          '-is-aggregated': node.isAggregated,
                          '-is-domestic': node.isDomesticConsumption,
                          '-is-alone-in-column': list.length === 1,
                          '-highlighted': highlightedNodeId === node.id,
                          '-selected': selectedNodesIds.includes(node.id)
                        })}
                        transform={`translate(0,${node.y})`}
                        onClick={() => onNodeClicked(node.id, node.isAggregated)}
                        onMouseOver={() => !node.isAggregated && onNodeHighlighted(node.id)}
                        onMouseOut={() => !node.isAggregated && onNodeHighlighted(null)}
                      >
                        <rect
                          className="sankey-node-rect"
                          width={layout.current.columnWidth()}
                          height={node.renderedHeight}
                        />
                        <text
                          className="sankey-node-labels"
                          transform={`translate(0,${-7 +
                            node.renderedHeight / 2 -
                            (node.label.length - 1) * 7})`}
                        >
                          <tspan
                            className="sankey-node-label"
                            x={layout.current.columnWidth() / 2}
                            dy={12}
                          >
                            {node.label.length > 0 && node.label[0].toUpperCase()}
                          </tspan>
                        </text>
                      </g>
                    ))}
                  </g>
                </g>
              ))}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

NewSankey.propTypes = {
  detailedView: PropTypes.bool,
  selectedRecolorBy: PropTypes.object,
  onNodeClicked: PropTypes.func,
  highlightedNodeId: PropTypes.number,
  onNodeHighlighted: PropTypes.func,
  selectedNodesIds: PropTypes.array
};

export default NewSankey;
