import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendSubscriptionEmail } from 'react-components/shared/newsletter/newsletter.actions';
import NewsletterForm from './newsletter-form.component';

function mapStateToProps(state) {
  const { message } = state.newsletter[state.location.type];
  return {
    message
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ submitForm: sendSubscriptionEmail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsletterForm);
