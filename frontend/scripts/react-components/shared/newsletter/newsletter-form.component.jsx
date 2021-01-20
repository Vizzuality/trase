/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text';
import Link from 'redux-first-router-link';
import cx from 'classnames';

import Heading from 'react-components/shared/heading/heading.component';

import 'react-components/shared/newsletter/newsletter.scss';
import { startCase } from 'lodash';

class NewsletterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      form: {
        email: '',
        firstname: '',
        lastname: '',
        organisation: '',
        country: ''
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
    const { message, variant } = this.props;
    const { email } = this.state.form;
    const footer = variant === 'footer';
    const renderSubmitButton = () =>
      footer ? (
        <Button
          onClick={this.onClickSubmit}
          color="green"
          variant="circle"
          className="footer-submit-button"
        />
      ) : (
        <Button onClick={this.onClickSubmit} color="charcoal" weight="bold">
          Subscribe
        </Button>
      );

    const renderFormInput = (field, placeholder) => {
      const fields = {
        default: (
          <>
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, field)}
                type="text"
                name={field}
                placeholder={placeholder || field}
                id={`newsletter-${field}`}
                required
                className={cx({
                  'newsletter-input': true,
                  error: this.elementHasError(field)
                })}
              />
            </div>
            {this.elementHasError(field) && (
              <p className="error-message">{startCase(field)} is required</p>
            )}
          </>
        ),
        email: (
          <>
            <div className="newsletter-input-container">
              <input
                onInput={e => this.onFormInput(e, 'email')}
                type="email"
                name="email"
                placeholder={placeholder || 'Sign up here to receive updates'}
                id="newsletter-email"
                required
                className={cx({
                  'newsletter-input': true,
                  error: this.elementHasError('email')
                })}
              />
              {!footer && renderSubmitButton()}
            </div>
            {this.elementHasError('email') && (
              <p className="error-message">Please provide a valid email address</p>
            )}
          </>
        )
      };
      return fields[field] || fields.default;
    };

    const renderForm = () => (
      <>
        {message && <p className="subscription-success">{message}</p>}
        {!message && (
          <form
            ref={this.getFormRef}
            className={footer ? 'c-newsletter v-footer' : 'column small-12 medium-6 large-4'}
          >
            {footer ? (
              <>
                {renderFormInput('email', 'Enter your email...')}
                {renderFormInput('firstname', 'Enter your name...')}
                {renderFormInput('organisation', 'Your organization...')}
                {renderFormInput('country', 'Your country...')}
                <div className="footer-conditions">
                  <Text size="xs" as="div" color="white">
                    You can unsuscribe at any time.
                    <Link to="/about/privacy-policy">
                      <Text as="div" size="xs" color="white" className="link-text">
                        Learn about our privacy policies
                      </Text>
                    </Link>{' '}
                  </Text>
                  {renderSubmitButton()}
                </div>
              </>
            ) : (
              <>
                {renderFormInput('firstname')}
                {renderFormInput('lastname')}
                {renderFormInput('organisation')}
                {renderFormInput('email')}
                <div className={cx('conditions', { visible: !message && email })}>
                  <Text lineHeight="lg">
                    After subscribing I consent that my email address will be used in order for us
                    to send you the Trase newsletter. Please see our{' '}
                    <Link to="/about/privacy-policy">
                      <Text as="span" className="conditions-link">
                        privacy policy
                      </Text>
                    </Link>{' '}
                    for more details on the use of your information
                  </Text>
                </div>
              </>
            )}
          </form>
        )}
      </>
    );

    if (variant === 'footer') {
      return renderForm();
    }

    return (
      <div className={cx('c-newsletter align-middle align-right', { sent: message })}>
        <div className="newsletter row">
          <div className="column">
            <Heading variant="mono" color="pink" size="sm">
              STAY INFORMED
            </Heading>
            <p className="newsletter-text">
              Sign up to stay informed about Trase Earth, and other Trase developments and
              discoveries.
            </p>
          </div>
          {renderForm()}
        </div>
      </div>
    );
  }
}

NewsletterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  message: PropTypes.string,
  variant: PropTypes.string
};

export default NewsletterForm;
