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
      submitted: false,
      form: {
        email: '',
        firstname: '',
        lastname: '',
        organisation: ''
      }
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
    this.setState({ submitted: true, dirty: false });
    if (this.form.checkValidity()) {
      this.props.submitForm(this.state.form);
    }
  }

  onFormInput(e, type) {
    const { form } = this.state;
    this.setState({ dirty: true, form: { ...form, [type]: e.target.value } });
  }

  getFormRef(ref) {
    this.form = ref;
  }

  elementHasError(name) {
    const { submitted, dirty, form } = this.state;
    if (name === 'email') {
      const field = document.getElementById('newsletter-email');
      if (submitted && !field.checkValidity()) {
        return true;
      }
    }
    return submitted && !dirty && form[name].length === 0;
  }

  render() {
    const { message } = this.props;
    const { email } = this.state.form;

    return (
      <div className={cx('c-newsletter align-middle align-right', { sent: message })}>
        <div className="newsletter row">
          <div className="column">
            <Heading variant="mono" color="pink" size="sm">STAY INFORMED</Heading>
            <p className="newsletter-text">Sign up to stay informed about Trase Earth, and other Trase developments and discoveries.</p>
          </div>
          {message && (
            <p className="subscription-success">
              {message}
            </p>
          )}
          {!message && (
            <form ref={this.getFormRef} className="column small-12 medium-6 large-4">
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'firstname')}
                type="text"
                name="firstname"
                placeholder="firstname"
                id="newsletter-firstname"
                required
                className={cx({
                  'newsletter-input': true,
                  'error': this.elementHasError('firstname')
                })}
              />
            </div>

            {this.elementHasError('firstname') && <p className="error-message">Firstname is required</p>}

            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'lastname')}
                type="text"
                name="lastname"
                placeholder="lastname"
                id="newsletter-lastname"
                required
                className={cx({
                  'newsletter-input': true,
                  'error': this.elementHasError('lastname')
                })}
              />
            </div>

            {this.elementHasError('lastname') && <p className="error-message">Lastname is required</p>}

            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'organisation')}
                type="text"
                name="organisation"
                placeholder="organisation"
                id="newsletter-organisation"
                required
                className={cx({
                  'newsletter-input': true,
                  'error': this.elementHasError('organisation')
                })}
              />
            </div>

            {this.elementHasError('organisation') && <p className="error-message">Organisation is required</p>}

            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'email')}
                type="email"
                name="email"
                placeholder="Sign up here to receive updates"
                id="newsletter-email"
                required
                className={cx({
                  'newsletter-input': true,
                  'error': this.elementHasError('email')
                })}
              />
              <Button onClick={this.onClickSubmit} color="charcoal" weight="bold">
                Subscribe
              </Button>
            </div>

            {this.elementHasError('email') && <p className="error-message">Please provide a valid email address</p>}

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
        )}
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
