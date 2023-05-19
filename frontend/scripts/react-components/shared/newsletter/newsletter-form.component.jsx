/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text';
import cx from 'classnames';

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
      },
      formErrors: {}
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

  updateErrors(justSubmitted) {
    const { form, formErrors } = this.state;
    const updatedErrors = { ...formErrors };
    Object.keys(form).forEach(k => {
      updatedErrors[k] = this.elementHasError(k, justSubmitted);
    });
    this.setState({
      formErrors: updatedErrors
    });
  }

  componentDidUpdate(_, prevState) {
    const { form, submitted } = this.state;
    const { form: prevForm } = prevState;
    if (submitted) {
      const changedKey = Object.keys(form).find(k => prevForm[k] !== form[k]);
      if (changedKey) {
        this.updateErrors();
      }
    }
  }

  onClickSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    this.updateErrors(true);
    if (this.form.checkValidity()) {
      this.props.submitForm({
        ...this.state.form,
        subscribe: true,
        source: 'footer'
      });
    }
  }

  onFormInput(e, type) {
    const { form } = this.state;
    this.setState({ form: { ...form, [type]: e.target.value } });
  }

  getFormRef(ref) {
    this.form = ref;
  }

  elementHasError(name, justSubmitted) {
    if (name === 'country') return false; // Not included

    const { submitted, form } = this.state;
    const formSubmitted = justSubmitted || submitted;
    if (name === 'email') {
      const emailId = 'footer-email';
      const emailElement = document.getElementById(emailId);
      if (formSubmitted && !emailElement.checkValidity()) {
        return true;
      }
    }
    return (formSubmitted && form[name].length === 0) || false;
  }

  render() {
    const { message } = this.props;
    const { dropdownOpen } = this.state;

    const renderSubmitButton = () => (
      <Button
        onClick={this.onClickSubmit}
        color="green"
        variant="circle"
        className="footer-submit-button"
      >
        ➔
      </Button>
    );

    const renderFormInput = ({ field, placeholder, formName }) => {
      const id = `${formName}-${field}`;
      const hasError = this.state.formErrors[field];
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
                  error: hasError
                })}
              />
            </div>
            {hasError && <p className="error-message">{startCase(field)} is required</p>}
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
                  error: hasError
                })}
              />
            </div>
            {hasError && <p className="error-message">Please provide a valid email address</p>}
          </>
        )
      };
      return fields[field] || fields.default;
    };

    return (
      <>
        {message && <p className="subscription-success">{message}</p>}
        {!message && (
          <form ref={this.getFormRef} className="c-newsletter">
            <>
              <div className="dropdown-container">
                {renderFormInput({
                  field: 'email',
                  placeholder: 'Enter your email...',
                  formName: 'footer'
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
                  formName: 'footer'
                })}
                {renderFormInput({
                  field: 'lastname',
                  placeholder: 'Enter your last name...',
                  formName: 'footer'
                })}
                {renderFormInput({
                  field: 'organisation',
                  placeholder: 'Enter your organisation...',
                  formName: 'footer'
                })}
                <div className="footer-conditions">
                  <Text size="xs" as="span" color="white" lineHeight="sm" variant="sans">
                    You can unsuscribe at any time. Learn about our
                    <a
                      href="https://www.trase.earth/privacy-policy"
                      title="Privacy policy page"
                      // eslint-disable-next-line react/jsx-no-target-blank
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text as="span" size="xs" color="white" variant="sans" className="link-text">
                        {' '}
                        privacy policies
                      </Text>
                    </a>{' '}
                  </Text>
                  {renderSubmitButton()}
                </div>
              </div>
            </>
          </form>
        )}
      </>
    );
  }
}

NewsletterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  message: PropTypes.string
};

export default NewsletterForm;
