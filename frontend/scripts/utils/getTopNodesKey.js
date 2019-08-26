export default (ctx, col, start, end) =>
  ctx && col && start && end ? `CTX${ctx}_COL${col}_START${start}_END${end}` : null;
