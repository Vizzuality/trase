import { useState, useEffect } from 'react';

export function useFirstItem(items) {
  const [firstItem, setFirstItem] = useState(items[0]);
  useEffect(() => {
    if (firstItem !== items) {
      setFirstItem(items[0]);
    }
  }, [firstItem, items]);

  return firstItem;
}
