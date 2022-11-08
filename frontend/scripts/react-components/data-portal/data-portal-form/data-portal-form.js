import { connect } from 'react-redux';
import { newsletterActions } from 'react-components/shared/newsletter/newsletter.register';
import Component from './data-portal-form.component';

export default connect(null, newsletterActions)(Component);
