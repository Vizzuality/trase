/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text';
import Link from 'redux-first-router-link';
import cx from 'classnames';

import Heading from 'react-components/shared/heading/heading.component';

import 'react-components/shared/newsletter/newsletter.scss';

class NewsletterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstname: '',
      lastname: '',
      organisation: ''
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
      this.props.submitForm(this.state);
    }
  }

  onFormInput(e, type) {
    this.setState({ [type]: e.target.value });
  }

  getFormRef(ref) {
    this.form = ref;
  }

  render() {
    const { message } = this.props;
    const { email } = this.state;
    return (
      <div className={cx('c-newsletter align-middle align-right', { sent: message })}>
        <div className="newsletter row">
          <div className="column">
            <Heading variant="mono" color="pink" size="sm">STAY INFORMED</Heading>
            <p className="newsletter-text">Sign up to stay informed about Trase Earth, and other Trase developments and discoveries.</p>
          </div>
          <form ref={this.getFormRef} className="column small-12 medium-6 large-4">
            <label htmlFor="newsletter-email" className="newsletter-label -pink">
              {message}
            </label>
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'firstname')}
                type="text"
                name="firstname"
                placeholder="firstname"
                id="newsletter-firstname"
                required
                className="newsletter-input"
              />
            </div>
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'lastname')}
                type="text"
                name="lastname"
                placeholder="lastname"
                id="newsletter-lastname"
                required
                className="newsletter-input"
              />
            </div>
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'organisation')}
                type="text"
                name="organisation"
                placeholder="organisation"
                id="newsletter-organisation"
                required
                className="newsletter-input"
              />
            </div>
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'email')}
                type="email"
                name="email"
                placeholder="Sign up here to receive updates"
                id="newsletter-email"
                required
                className="newsletter-input"
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
