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
      dropdownOpen: false,
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

  toggleOpenDropdown() {
    this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }));
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
    const { dropdownOpen } = this.state;
    const footer = variant === 'footer';
    const renderSubmitButton = () =>
      footer ? (
        <Button
          onClick={this.onClickSubmit}
          color="green"
          variant="circle"
          className="footer-submit-button"
        >
          ➔
        </Button>
      ) : (
        <Button onClick={this.onClickSubmit} color="charcoal" weight="bold">
          Subscribe
        </Button>
      );

    const renderFormInput = ({ field, placeholder, formName }) => {
      const id = `${formName}${field}`;
      const fields = {
        default: (
          <>
            <div className="newsletter-input-container">
              <label className="visually-hidden" htmlFor={id}>
                {placeholder || field}
              </label>
              <input
                onInput={e => this.onFormInput(e, field)}
                type="text"
                name={field}
                placeholder={placeholder || field}
                id={id}
                required
                className={cx('newsletter-input', {
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
              <label className="visually-hidden" htmlFor={id}>
                {placeholder || 'Sign up here to receive updates'}
              </label>
              <input
                onInput={e => {
                  if (!dropdownOpen) {
                    this.toggleOpenDropdown();
                  }
                  this.onFormInput(e, 'email');
                }}
                type="email"
                name="email"
                placeholder={placeholder || 'Sign up here to receive updates'}
                id={id}
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
                <div className="dropdown-container">
                  {renderFormInput({
                    field: 'email',
                    placeholder: 'Enter your email...',
                    formName: 'stay-informed'
                  })}
                  <Button
                    variant="circle"
                    onClick={() => this.toggleOpenDropdown()}
                    color="green"
                    className={cx('dropdown-button', { '-open': dropdownOpen })}
                  />
                </div>
                <div className={cx('form-hidden-fields', { '-open': dropdownOpen })}>
                  {renderFormInput({
                    field: 'firstname',
                    placeholder: 'Enter your first name...',
                    formName: 'stay-informed'
                  })}
                  {renderFormInput({
                    field: 'lastname',
                    placeholder: 'Enter your last name...',
                    formName: 'stay-informed'
                  })}
                  {renderFormInput({
                    field: 'organisation',
                    placeholder: 'Your organisation...',
                    formName: 'stay-informed'
                  })}
                  <div className="footer-conditions">
                    <Text size="xs" as="span" color="white" lineHeight="md">
                      You can unsuscribe at any time. Learn about our
                      <Link to="/about/privacy-policy">
                        <Text as="span" size="xs" color="white" className="link-text">
                          {' '}
                          privacy policies
                        </Text>
                      </Link>{' '}
                    </Text>
                    {renderSubmitButton()}
                  </div>
                </div>
              </>
            ) : (
              <>
                {renderFormInput({
                  field: 'firstname',
                  placeholder: 'First name',
                  formName: 'footer'
                })}
                {renderFormInput({
                  field: 'lastname',
                  placeholder: 'Last name',
                  formName: 'footer'
                })}
                {renderFormInput({ field: 'organisation', formName: 'footer' })}
                {renderFormInput({ field: 'email', formName: 'footer' })}
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
