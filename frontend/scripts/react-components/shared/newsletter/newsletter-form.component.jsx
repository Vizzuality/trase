/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text';
import Link from 'redux-first-router-link';
import cx from 'classnames';

import 'react-components/shared/newsletter/newsletter.scss';

class NewsletterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.onFormInput = this.onFormInput.bind(this);
    this.getFormRef = this.getFormRef.bind(this);
  }

  componentWillUnmount() {
    this.props.resetForm();
  }

  onClickSubmit(e) {
    e.preventDefault();
    if (this.form.checkValidity()) {
      this.props.submitForm(this.state.email);
    }
  }

  onFormInput(e) {
    const email = e.target.value;
    this.setState({ email });
  }

  getFormRef(ref) {
    this.form = ref;
  }

  render() {
    const { message } = this.props;
    const { email } = this.state;
    return (
      <div className={cx('c-newsletter row align-middle align-right', { sent: message })}>
        <form ref={this.getFormRef} className="column small-12 medium-6 large-4">
          <label htmlFor="newsletter-email" className="newsletter-label -pink">
            {message}
          </label>
          <div className="newsletter-input-container">
            <input
              onInput={this.onFormInput}
              type="email"
              name="email"
              placeholder="Sign up here to receive updates"
              id="newsletter-email"
              required
              className="newsletter-email"
            />
            <Button onClick={this.onClickSubmit} color="charcoal" weight="bold">
              Subscribe
            </Button>
          </div>
          <div className={cx("conditions", { visible: !message && email }) }>
            <Text lineHeight="lg">
              After subscribing I consent that my email address will be used in order for us to
              send you the Trase newsletter. Please see our{' '}
              <Link to="/about/privacy-policy">
                <Text as="span" className="conditions-link">
                  privacy policy
                </Text>
              </Link>{' '}
              for more details on the use of your information
            </Text>
          </div>
        </form>
      </div>
    );
  }
}

NewsletterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  message: PropTypes.string
};

export default NewsletterForm;
