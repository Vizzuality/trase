import { connect } from 'react-redux'
import Component from './data-portal-form.component';
import { newsletterActions } from 'react-components/shared/newsletter/newsletter.register';

export default connect(null, newsletterActions)(Component);