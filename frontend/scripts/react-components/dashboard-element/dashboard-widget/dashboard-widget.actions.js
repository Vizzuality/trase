export const DASHBOARD_WIDGET__TRACK_OPEN_TABLE_VIEW = 'DASHBOARD_WIDGET__TRACK_OPEN_TABLE_VIEW';

export const trackOpenTableView = title => ({
  type: DASHBOARD_WIDGET__TRACK_OPEN_TABLE_VIEW,
  payload: { title }
});
