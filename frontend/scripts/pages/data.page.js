/* eslint-disable no-new */
import DataMarkup from 'html/data.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import AutocompleteCountriesMarkup from 'html/includes/_autocomplete_countries.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';
import DataContentContainer from 'containers/data/data-content.container';
import NavContainer from 'containers/shared/nav.container';
import { loadContext } from 'actions/data.actions';
import 'styles/data.scss';
import 'styles/components/shared/veil.scss';
import 'styles/components/shared/modal.scss';

const mount = (root, store) => {
  root.innerHTML = DataMarkup({
    nav: NavMarkup({ page: 'data' }),
    footer: FooterMarkup(),
    autocomplete_countries: AutocompleteCountriesMarkup(),
    feedback: FeedbackMarkup()
  });
  new DataContentContainer(store);
  store.dispatch(loadContext());

  new NavContainer(store);
};

export default { mount };
