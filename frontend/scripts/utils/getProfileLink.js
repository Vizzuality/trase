import { DEFAULT_PROFILE_PAGE_YEAR } from '../constants';

export default (node, year = DEFAULT_PROFILE_PAGE_YEAR) =>
  `./profile-${node.profileType}?nodeId=${node.id}&year=${year}`;
