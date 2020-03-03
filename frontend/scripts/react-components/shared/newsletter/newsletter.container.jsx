import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { newsletterActions } from 'react-components/shared/newsletter/newsletter.register';
import NewsletterForm from './newsletter-form.component';

function mapStateToProps(state) {
  const { message } = state.newsletter;
  return {
    message
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetForm: newsletterActions.resetNewsletter,
      submitForm: newsletterActions.sendSubscriptionEmail
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsletterForm);
