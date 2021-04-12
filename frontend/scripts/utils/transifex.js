export function translateText(str) {
  const { Transifex } = window;
  if (typeof Transifex !== 'undefined' && str) {
    console.log('translatable', str);
    return Transifex.live.translateText(str);
  }
  console.warn('Attempted translation before transifex finished loading:', str);
  return str;
}

export function translateNode(node) {
  const { Transifex } = window;
  if (typeof Transifex !== 'undefined' && node) {
    return Transifex.live.translateNode(node);
  }
  return node;
}
