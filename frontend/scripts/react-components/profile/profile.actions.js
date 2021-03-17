import axios from 'axios';

export const SET_PROFILE_PLACE_BOUNDS = 'SET_PROFILE_PLACE_BOUNDS';

export const getProfilePlaceBounds = (layerName, geoid, geoidName = 'geoid') => dispatch => {
  const getCartoUrl = sql => `https://${CARTO_ACCOUNT}.carto.com/api/v2/sql?q=${sql}`;
  const url = getCartoUrl(`
    SELECT ST_Xmax(the_geom) as xmax,
    ST_Ymax(the_geom) as ymax,
    ST_Xmin(the_geom) as  xmin,
    ST_Ymin(the_geom) as ymin
    FROM ${layerName} WHERE ${geoidName}='${geoid}'`);
  axios(url)
    .then(res => {
      const results = res.data;
      if (!results) return;
      const { xmax, xmin, ymax, ymin } = results.rows[0];
      const bounds = [xmax, xmin, ymax, ymin];
      dispatch({
        type: SET_PROFILE_PLACE_BOUNDS,
        payload: bounds
      });
    })
    .catch(reason => {
      console.error('Error loading profile bounds', reason);
    });
};
