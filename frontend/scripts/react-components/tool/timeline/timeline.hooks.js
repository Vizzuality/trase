import { useEffect, useRef, useState } from 'react';

export function useSlider({ years, selectedYears }) {
  const [page, setPage] = useState(0);
  const container = useRef(null);
  const contentList = useRef(null);
  const item = useRef(null);
  const [sizes, setSizes] = useState({ item: 0, page: 0, visible: 0 });

  const DEFAULT_PAGE_SIZE = 3;
  const MARGIN_BETWEEN_ITEMS = 12; // corresponding to timeline.scss values

  const maxVisibleItems = sizes.container ? Math.floor(sizes.container / sizes.item) : 0;
  const pointer = page > 0 ? page * DEFAULT_PAGE_SIZE + 1 : 0;
  const remainingItems = years.length - pointer;
  const jumpToPage = (_page, pageSize = DEFAULT_PAGE_SIZE) =>
    -_page * sizes.item * pageSize - (_page > 0 ? MARGIN_BETWEEN_ITEMS * 2 : 0);

  let hasNextPage = remainingItems > maxVisibleItems;
  let jump = jumpToPage(page);
  if (remainingItems % DEFAULT_PAGE_SIZE > 0 && remainingItems < maxVisibleItems && page > 0) {
    hasNextPage = false;
    jump = jumpToPage(page - 1) + jumpToPage(1, remainingItems % DEFAULT_PAGE_SIZE);
  }
  const transform = `translate3d(${jump}px, 0, 0)`;

  useEffect(() => {
    if (container.current && contentList.current && item.current) {
      const containerBounds = container.current.getBoundingClientRect();
      const listBounds = contentList.current.getBoundingClientRect();
      const itemBounds = item.current.getBoundingClientRect();
      const newSizes = {
        item: Math.ceil(itemBounds.width) + MARGIN_BETWEEN_ITEMS,
        list: Math.floor(listBounds.width) - MARGIN_BETWEEN_ITEMS,
        container: Math.floor(containerBounds.width)
      };
      setSizes(newSizes);
    }
  }, [years]);

  useEffect(() => {
    const startYearIndex = years.findIndex(i => i === selectedYears[0]);
    const position = startYearIndex / maxVisibleItems + ((startYearIndex / maxVisibleItems) % 1);
    const numPages = years.length / maxVisibleItems - 1;
    const selectedYearPage = position > 1 ? Math.ceil(position) : Math.floor(position);
    const pageToStart = numPages > 0 ? selectedYearPage : 0;
    setPage(pageToStart);

    // we want to recalculate the active page only when the sizes change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes, years]);

  return {
    refs: {
      container,
      contentList,
      item
    },
    sizes,
    MARGIN_BETWEEN_ITEMS,
    transform,
    hasNextPage,
    hasPrevPage: page > 0,
    onPrevious: () => setPage(p => p - 1),
    onNext: () => setPage(p => p + 1),
  };
}
