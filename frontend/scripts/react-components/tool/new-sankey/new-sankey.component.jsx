import React, { useEffect, useRef, useState } from 'react';
import sankeyLayout from 'react-components/tool/sankey/sankey.d3layout';
import cx from 'classnames';
import 'styles/components/tool/sankey.scss';
import { DETAILED_VIEW_MIN_LINK_HEIGHT } from 'constants';
import { animated, useSpring } from 'react-spring';
import toLower from 'lodash/toLower';

function SankeyLink(props) {
  const { link, className, hovered, ...path } = props;
  const { strokeWidth } = useSpring({
    to: { strokeWidth: Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, link.renderedHeight) },
    from: { strokeWidth: 0 }
  });
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
  const { links, sankeySize, selectedRecolorBy, onNodeClicked } = props;
  const [isReady, setIsReady] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const layout = useRef(sankeyLayout().columnWidth(100));
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
  }, [links, props, sankeySize]);

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

  const columns = layout.current.columns();
  const linksData = layout.current.links();

  if (!isReady) {
    return null;
  }

  return (
    <div className="c-sankey is-absolute">
      <div className="sankey-scroll-container">
        <svg className="sankey" height="100%">
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
                <SankeyLink
                  link={link}
                  onMouseOver={onLinkOver}
                  className={getLinkColor(link)}
                  d={layout.current.link()(link)}
                  hovered={hoveredLink === link.id}
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
                      <g
                        key={node.id}
                        className={cx('sankey-node', {
                          '-is-aggregated': node.isAggregated,
                          '-is-domestic': node.isDomesticConsumption,
                          '-is-alone-in-column': list.length === 1
                        })}
                        transform={`translate(0,${node.y})`}
                        onClick={() => onNodeClicked(node.id, node.isAggregated)}
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
