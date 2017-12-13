import TermsOfUseMarkup from 'html/terms-of-use.ejs';
import NavMarkup from 'html/includes/_nav.ejs';
import FooterMarkup from 'html/includes/_footer.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import Nav from 'components/shared/nav.component.js';
import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-terms-of-use.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/shared/button.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';

export const mount = (root) => {
  root.innerHTML = TermsOfUseMarkup({
    nav: NavMarkup({ page: 'terms-of-use' }),
    footer: FooterMarkup(),
    feedback: FeedbackMarkup()
  });
  new Nav();
};
