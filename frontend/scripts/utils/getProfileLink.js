// See https://github.com/sei-international/TRASE/issu  es/112
import { DEFAULT_PROFILE_PAGE_YEAR } from '../constants';

export default (node, year = DEFAULT_PROFILE_PAGE_YEAR) => {
  return `./profile-${node.profileType}.html?nodeId=${node.id}&year=${year}`;
};
