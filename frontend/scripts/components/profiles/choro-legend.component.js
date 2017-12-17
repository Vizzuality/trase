import LegendChoroTemplate from 'templates/tool/map/legend-choro.ejs';
import 'styles/components/tool/map/map-legend.scss';
import { PROFILE_CHOROPLETH_CLASSES } from 'constants';
import abbreviateNumber from 'utils/abbreviateNumber';

export default (selector, legend, { title, bucket }) => {
  // const el = document.querySelector(selector);
  // el.classList.add('-with-legend');

  const legendTemplate = LegendChoroTemplate({
    title,
    cssClass: '-horizontal -profile',
    colors: PROFILE_CHOROPLETH_CLASSES,
    bucket,
    abbreviateNumber: (x, y, index) => (index === 0 ? `<${abbreviateNumber(x, 0)}` : `>${abbreviateNumber(x, 0)}`),
    isBivariate: false
  });

  const container = document.querySelector(legend);
  container.classList.add('c-map-legend-choro');
  container.innerHTML = legendTemplate;
};
