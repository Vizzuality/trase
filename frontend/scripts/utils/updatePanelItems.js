import castArray from 'lodash/castArray';
import omit from 'lodash/omit';

export default (currentItems, newItem) => {
  const newItems = castArray(newItem);

  // Remove new items if they are included
  const itemsToRemove = [];
  newItems.forEach(i => {
    if (currentItems[i.id]) itemsToRemove.push(i);
  });
  if (itemsToRemove.length > 0) {
    return omit(currentItems, itemsToRemove.map(i => i.id));
  }

  // Add new items otherwise
  const itemsToAdd = {};
  newItems.forEach(i => {
    itemsToAdd[i.id] = i;
  });

  // check that item is of the same type
  const currentType = Object.values(currentItems)[0] && Object.values(currentItems)[0].nodeType;
  const incomingType = newItems[0] && newItems[0].nodeType;

  if (currentType && currentType !== incomingType) {
    return itemsToAdd; // clear old type otherwise
  }

  return { ...currentItems, ...itemsToAdd };
};
