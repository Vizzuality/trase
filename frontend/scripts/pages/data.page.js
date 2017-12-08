import DataMarkup from 'html/data.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import AutocompleteCountriesMarkup from 'html/includes/_autocomplete_countries.ejs';

import DataContentContainer from 'containers/data/data-content.container';
import Nav from 'components/shared/nav.component.js';
import { loadContext } from 'actions/data.actions';

import 'styles/data.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';


export const render = (root, store) => {
  root.innerHTML = DataMarkup({
    nav: NavMarkup({ page: 'data' }),
    footer: FooterMarkup(),
    autocomplete_countries: AutocompleteCountriesMarkup()
  });
  new DataContentContainer(store);
  store.dispatch(loadContext());

  new Nav();
};
