/* eslint-disable jsx-a11y/label-has-for,jsx-a11y/no-static-element-interactions,jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import axios from 'axios';
import MethodsDisclaimer from 'react-components/shared/methods-disclaimer';
import Heading from 'react-components/shared/heading';
import Text from 'react-components/shared/text';
import { COUNTRIES } from '../../../countries';
import './download-form.scss';

class DataPortalForm extends Component {
  constructor(props) {
    super(props);

    this.formFieldWhiteList = [
      'name',
      'lastname',
      'subscribe',
      'country',
      'organisation',
      'organisationType',
      'dataUse',
      'comments',
      'email',
      'traseType',
      'traseUse',
      'traseWork'
    ];

    this.state = {
      showTOSWarning: false,
      showEmailWarning: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getFormData(form) {
    const data = {};
    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i];
      if (element.tagName !== 'BUTTON') {
        data[element.id] = element.type === 'checkbox' ? element.checked : element.value;
      }
    }
    return data;
  }

  handleSubmit(event) {
    const { sendSubscriptionEmail } = this.props;

    event.preventDefault();
    const { downloaded, downloadFile, closeForm } = this.props;
    const data = this.getFormData(event.target);
    const payload = {};

    this.formFieldWhiteList.forEach(elem => {
      if (data[elem] !== '') {
        payload[elem] = data[elem];
      }
    });

    if (!downloaded && !(data.tos_check && data.email)) {
      this.setState({ showTOSWarning: !data.tos_check, showEmailWarning: !data.email });
      return;
    }

    if (!downloaded && !data.email) {
      return;
    }

    payload.date = new Date().toString();

    if (!downloaded) {
      downloadFile();
    }

    // Check if we have user data, and if not, ask for it
    if (Object.values(payload).filter(v => v !== '').length === 1) {
      return;
    }

    const dataSubmitBody = new FormData();
    Object.keys(payload).forEach(key => {
      dataSubmitBody.append(key, payload[key]);
    });
    axios.post(DATA_FORM_ENDPOINT, dataSubmitBody);

    if (payload.email) {
      sendSubscriptionEmail({
        email: payload.email,
        firstname: payload.name,
        lastname: payload.lastname,
        organisation: payload.organisation,
        country: payload.country,
        subscribe: payload.subscribe,
        traseType: payload.traseType,
        traseUse: payload.traseUse,
        traseWork: payload.traseWork,
        source: 'download'
      });
    }

    closeForm();
  }

  generateCountryList(id) {
    return (
      <datalist id={id}>
        <option value="">Select country</option>
        {COUNTRIES.map(elem => (
          <option key={elem}>{elem}</option>
        ))}
      </datalist>
    );
  }

  render() {
    const { isBrazilSoyException } = this.props;
    return (
      <div className={cx({ 'is-hidden': !this.props.isFormVisible })}>
        <div className="veil -below-nav" onClick={this.props.closeForm} />
        <div className="c-modal -below-nav">
          <div className="content -white -big-margin">
            <form className="c-download-form" onSubmit={this.handleSubmit}>
              <Heading as="h2" weight="bold" size="md" className="description-title">
                Thank you for your interest in downloading data from Trase!
              </Heading>
              <Text as="p" className="description">
                To help us better understand how the data is currently being used and to improve the
                platform, we would appreciate if you could tell us a bit about yourself and your
                work.
              </Text>
              <p className={cx('missing', { 'is-hidden': !this.props.downloaded })}>
                We&apos;d love to hear about how you use the data and how we could improve it.
                Please fill in details below and click on &apos;submit&apos;:
              </p>
              {isBrazilSoyException && <MethodsDisclaimer />}
              <label htmlFor="name">
                First name
                <input type="text" placeholder="Type first name" id="name" />
              </label>
              <label htmlFor="lastname">
                Last name
                <input type="text" placeholder="Type last name" id="lastname" />
              </label>
              <label
                htmlFor="email"
                className={cx('email', { highlighted: this.state.showEmailWarning })}
              >
                E-mail address<span className="highlighted">*</span>{' '}
                <span className="gray">(required field)</span>
                <input type="email" placeholder="Type email" id="email" />
              </label>

              <label htmlFor="country">
                Country
                <input
                  type="text"
                  placeholder="Select or type country..."
                  id="country"
                  list="countriesList"
                />
                {this.generateCountryList('countriesList')}
              </label>

              <label htmlFor="organisation">
                Organisation
                <input type="text" placeholder="Type organisation name" id="organisation" />
              </label>

              <label htmlFor="traseType">
                What describes your organisation best?
                <input
                  type="text"
                  placeholder="Select or type..."
                  id="traseType"
                  list="organisationTypeList"
                />
                <datalist id="organisationTypeList">
                  <option>Company</option>
                  <option>Financial institution</option>
                  <option>Government agency</option>
                  <option>Media</option>
                  <option>Research organisation</option>
                </datalist>
              </label>
              <label htmlFor="traseWork">
                What describes your work best?
                <input type="text" placeholder="Type comments" id="traseWork" />
              </label>

              <label htmlFor="traseUse">
                How will you use the data?
                <input
                  type="text"
                  placeholder="Select or type..."
                  id="traseUse"
                  list="dataUseList"
                />
                <datalist id="dataUseList">
                  <option>Decision support</option>
                  <option>Media and outreach</option>
                  <option>Research</option>
                </datalist>
              </label>
              <label htmlFor="subscribe" className="first-checkbox">
                <input type="checkbox" id="subscribe" /> Would you like to hear more about
                Trase&apos;s work by signing up to the mailing list?
              </label>
              <p
                className={cx(
                  'tos',
                  { highlighted: this.state.showTOSWarning },
                  { 'is-hidden': this.props.downloaded }
                )}
              >
                <label htmlFor="tos_check">
                  <input type="checkbox" id="tos_check" />
                  &nbsp;* I agree to the&nbsp;
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://www.trase.earth/terms-of-use"
                  >
                    Terms of use
                  </a>{' '}
                  <span className="gray">(required field)</span>
                </label>
              </p>
              <label className="submit">
                <button
                  type="submit"
                  className={cx('download-button', { 'is-hidden': !this.props.downloaded })}
                >
                  Submit
                </button>
                <button
                  type="submit"
                  className={cx('download-button', { 'is-hidden': this.props.downloaded })}
                >
                  <svg className="icon icon-download">
                    <use xlinkHref="#icon-download" />
                  </svg>
                  Download data
                </button>
              </label>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

DataPortalForm.propTypes = {
  isFormVisible: PropTypes.bool,
  closeForm: PropTypes.func,
  downloadFile: PropTypes.func,
  sendSubscriptionEmail: PropTypes.func,
  downloaded: PropTypes.bool,
  isBrazilSoyException: PropTypes.bool
};

export default DataPortalForm;
