/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
    return (
      <section className="c-newsletter">
        <div className="newsletter-content row align-middle">
          <form ref={this.getFormRef} className="column small-6 js-form c-newsletter-form">
            <label
              htmlFor="newsletter-email"
              className={cx('newsletter-label', { '-pink': message })}
            >
              {message || 'Sign up here to receive news updates about TRASE'}
            </label>
            <div className="newsletter-input-container">
              <input
                onInput={this.onFormInput}
                type="email"
                name="email"
                placeholder="email address"
                id="newsletter-email"
                required
                className="newsletter-email"
              />
              <button onClick={this.onClickSubmit} className="c-button -charcoal -bold">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

NewsletterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  message: PropTypes.string
};

export default NewsletterForm;
