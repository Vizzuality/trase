export default (ctx, col, start, end) =>
  ctx && col && start && end
    ? `CTX${ctx}_COL${col}${start ? `_START${start}` : ''}${end ? `_END${end}` : ''}`
    : null;
