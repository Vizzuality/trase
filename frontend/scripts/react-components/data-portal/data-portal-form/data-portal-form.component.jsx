/* eslint-disable jsx-a11y/label-has-for,jsx-a11y/no-static-element-interactions,jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import axios from 'axios';
import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER_URL } from '../../../utils/getURLFromParams';
import { COUNTRIES } from '../../../countries';

import './download-form.scss';

class DataPortalForm extends Component {
  constructor(props) {
    super(props);

    this.formFieldWhiteList = [
      'name',
      'country',
      'organisation',
      'organisationType',
      'dataUse',
      'comments',
      'email'
    ];

    this.state = {
      showTOSWarning: false
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
    event.preventDefault();
    const { downloaded, downloadFile, closeForm } = this.props;
    const data = this.getFormData(event.target);
    const payload = {};

    this.formFieldWhiteList.forEach(elem => {
      if (data[elem] !== '') {
        payload[elem] = data[elem];
      }
    });

    if (!downloaded && !data.tos_check) {
      this.setState({ showTOSWarning: true });
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
      const newsletterSubscribeBody = new FormData();
      newsletterSubscribeBody.append('email', payload.email);

      axios.post(getURLFromParams(POST_SUBSCRIBE_NEWSLETTER_URL), newsletterSubscribeBody);
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
    return (
      <div className={cx({ 'is-hidden': !this.props.isFormVisible })}>
        <div className="veil -below-nav" onClick={this.props.closeForm} />
        <div className="c-modal -below-nav">
          <div className="content -white -big-margin">
            <form className="c-download-form" onSubmit={this.handleSubmit}>
              <p className="description">
                Thank you for your interest in downloading data from Trase! To help us better
                understand how the data is currently being used and to improve the platform, we
                would appreciate if you could tell us a bit about yourself and your work.
              </p>
              <p className={cx('missing', { 'is-hidden': !this.props.downloaded })}>
                We&apos;d love to hear about how you use the data and how we could improve it.
                Please fill in details below and click on &apos;submit&apos;:
              </p>
              <label htmlFor="name">
                Name:
                <input type="text" placeholder="type name" id="name" />
              </label>

              <label htmlFor="country">
                Country:
                <input
                  type="text"
                  placeholder="select or type country..."
                  id="country"
                  list="countriesList"
                />
                {this.generateCountryList('countriesList')}
              </label>

              <label htmlFor="organisation">
                Organisation name:
                <input type="text" placeholder="type organisation name" id="organisation" />
              </label>

              <label htmlFor="organisationType">
                Select or type the option that best describes your organisation:
                <input
                  type="text"
                  placeholder="select or type..."
                  id="organisationType"
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

              <label htmlFor="dataUse">
                How will you use the data?
                <input
                  type="text"
                  placeholder="select or type..."
                  id="dataUse"
                  list="dataUseList"
                />
                <datalist id="dataUseList">
                  <option>Decision support</option>
                  <option>Media and outreach</option>
                  <option>Research</option>
                </datalist>
              </label>

              <label htmlFor="comments">
                Please tell us more about your work and if you are interested in helping improve
                Trase:
                <input type="text" placeholder="type comments" id="comments" />
              </label>

              <label htmlFor="email">
                If you would like to sign up for the Trase quarterly newsletter, please provide your
                email address:
                <input type="email" placeholder="type email" id="email" />
              </label>

              <p
                className={cx(
                  'tos',
                  { '-highlighted': this.state.showTOSWarning },
                  { 'is-hidden': this.props.downloaded }
                )}
              >
                <label htmlFor="tos_check">
                  <input type="checkbox" id="tos_check" />
                  &nbsp;* I agree to the&nbsp;
                  <a rel="noopener noreferrer" target="_blank" href="/about/terms-of-use">
                    Terms of use
                  </a>{' '}
                  (required field).
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
  downloaded: PropTypes.bool
};

export default DataPortalForm;
