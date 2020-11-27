import { format } from 'd3-format';
import { DEFAULT_DASHBOARD_UNIT_FORMAT } from 'constants';

export default (data, suffix) => {
  if(!data) return 'N/A';
  if(suffix === 't' && data < 1) {
    return '<1 t';
  }
  return `${format(DEFAULT_DASHBOARD_UNIT_FORMAT)(data)}${suffix ? ` ${suffix}` : ''}`;
}
