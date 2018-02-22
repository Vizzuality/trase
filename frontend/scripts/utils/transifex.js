export default function translateText(str) {
  const { Transifex } = window;
  if (typeof Transifex !== 'undefined' && str) {
    return Transifex.live.translateText(str);
  }
  return str;
}
