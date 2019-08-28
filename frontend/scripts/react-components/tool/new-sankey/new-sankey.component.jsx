import React, { useEffect, useRef, useState } from 'react';
import sankeyLayout from 'react-components/tool/sankey/sankey.d3layout';
import cx from 'classnames';
import 'styles/components/tool/sankey.scss';
import { DETAILED_VIEW_MIN_LINK_HEIGHT } from 'constants';
import { animated, useTransition } from 'react-spring';
import toLower from 'lodash/toLower';
import NodeMenu from './node-menu.component';

function SankeyLink(props) {
  const { link, className, hovered, strokeWidth, ...path } = props;
  // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
  return (
    <animated.path
      {...path}
      key={link.id}
      id={link.id}
      strokeWidth={strokeWidth}
      className={cx(className, { '-hover': hovered })}
    />
  );
}

function NewSankey(props) {
  const {
    links,
    sankeySize,
    detailedView,
    selectedRecolorBy,
    onNodeClicked,
    highlightedNodeId,
    onNodeHighlighted,
    selectedNodesIds
  } = props;
  const [isReady, setIsReady] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const layout = useRef(sankeyLayout().columnWidth(100));
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef(null);
  const columns = layout.current.columns();
  const linksData = layout.current.links();

  const linksTransitions = useTransition(linksData || [], i => i.id, {
    enter: link => ({ strokeWidth: Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, link.renderedHeight) }),
    leave: { strokeWidth: 0 },
    from: { strokeWidth: 0 }
  });
  // showLoadedLinks
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
          const y = Math.max(0, node.y) - (scrollContainerRef.current?.scrollTop || 0);
          setMenuPos({ x, y });
          return true;
        }
        return false;
      })
    );
  }, [selectedNodesIds, links, isReady, columns]);

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

  const onLinkOver = e => {
    setHoveredLink(e.currentTarget.id);
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
        <NodeMenu
          menuPos={menuPos}
          isVisible={selectedNodesIds.length > 0}
          options={[{ label: 'Expand' }, { label: 'Clear Selection' }]}
        />
        <svg
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
              {linksTransitions.map(transition => (
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                <SankeyLink
                  link={transition.item}
                  onMouseOver={onLinkOver}
                  strokeWidth={transition.props.strokeWidth}
                  className={getLinkColor(transition.item)}
                  d={layout.current.link()(transition.item)}
                  hovered={hoveredLink === transition.item.id}
                  onMouseOut={() => setHoveredLink(null)}
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

export default NewSankey;
