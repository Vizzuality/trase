export const DASHBOARD_WIDGET__OPEN_TABLE_VIEW = 'DASHBOARD_WIDGET__OPEN_TABLE_VIEW';

export const openTableView = title => ({
  type: DASHBOARD_WIDGET__OPEN_TABLE_VIEW,
  payload: { title }
});
