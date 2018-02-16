/* eslint-disable jsx-a11y/label-has-for,jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getURLFromParams, POST_SUBSCRIBE_NEWSLETTER_URL } from 'utils/getURLFromParams';
import i18n from 'utils/transifex';
import { COUNTRIES } from '../../countries';

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
      name: '',
      country: '',
      organisation: '',
      organisationType: '',
      dataUse: '',
      comments: '',
      email: '',
      tos_check: '',

      showTOSWarning: false
    };
  }

  onFieldValueChanged(field, value) {
    const newState = {};
    newState[field] = value;
    this.setState(newState);
  }

  sendForm() {
    const payload = {};

    this.formFieldWhiteList.forEach(elem => {
      if (this.state[elem] !== '') {
        payload[elem] = this.state[elem];
      }
    });

    if (!this.state.tos_check) {
      this.setState({ showTOSWarning: true });
      return;
    }

    delete payload.tos_check;
    payload.date = new Date().toString();

    if (!this.props.downloaded) {
      this.props.downloadFile();
    }

    // Check if we have user data, and if not, ask for it
    if (Object.values(payload).filter(v => v !== '').length === 1) {
      // this._setFormStatus(true);
      return;
    }

    const dataSubmitBody = new FormData();
    Object.keys(payload).forEach(key => {
      dataSubmitBody.append(key, payload[key]);
    });

    fetch(DATA_FORM_ENDPOINT, {
      method: 'POST',
      body: dataSubmitBody
    });

    if (payload.email) {
      const newsletterSubscribeBody = new FormData();
      newsletterSubscribeBody.append('email', payload.email);

      fetch(getURLFromParams(POST_SUBSCRIBE_NEWSLETTER_URL), {
        method: 'POST',
        body: newsletterSubscribeBody
      });
    }

    this.props.closeForm();
  }

  generateCountryList(id) {
    return (
      <datalist id={id}>
        <option value="">Select country</option>
        {COUNTRIES.map(elem => <option key={elem}>{elem}</option>)}
      </datalist>
    );
  }

  render() {
    return (
      <div className={cx({ 'is-hidden': !this.props.formVisible })}>
        <div className="veil -below-nav" onClick={this.props.closeForm} />
        <div className="c-modal -below-nav">
          <div className="content -white -big-margin">
            <form className="c-download-form">
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
                <input
                  type="text"
                  placeholder={i18n('type name')}
                  id="name"
                  value={this.state.name}
                  onChange={event => this.onFieldValueChanged('name', event.target.value)}
                />
              </label>

              <label htmlFor="country">
                Country:
                <input
                  type="text"
                  placeholder={i18n('select or type country...')}
                  id="country"
                  list="countriesList"
                  value={this.state.country}
                  onChange={event => this.onFieldValueChanged('country', event.target.value)}
                />
                {this.generateCountryList('countriesList')}
              </label>

              <label htmlFor="organisation">
                Organisation name:
                <input
                  type="text"
                  placeholder={i18n('type organisation name')}
                  id="organisation"
                  value={this.state.organisation}
                  onChange={event => this.onFieldValueChanged('organisation', event.target.value)}
                />
              </label>

              <label htmlFor="organisationType">
                Select or type the option that best describes your organisation:
                <input
                  type="text"
                  placeholder={i18n('select or type...')}
                  id="organisationType"
                  list="organisationTypeList"
                  value={this.state.organisationType}
                  onChange={event =>
                    this.onFieldValueChanged('organisationType', event.target.value)
                  }
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
                  placeholder={i18n('select or type...')}
                  id="dataUse"
                  list="dataUseList"
                  value={this.state.dataUse}
                  onChange={event => this.onFieldValueChanged('dataUse', event.target.value)}
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
                <input
                  type="text"
                  placeholder={i18n('type comments')}
                  id="comments"
                  value={this.state.comments}
                  onChange={event => this.onFieldValueChanged('comments', event.target.value)}
                />
              </label>

              <label htmlFor="email">
                If you would like to sign up for the Trase quarterly newsletter, please provide your
                email address:
                <input
                  type="email"
                  placeholder={i18n('type email')}
                  id="email"
                  value={this.state.email}
                  onChange={event => this.onFieldValueChanged('email', event.target.value)}
                />
              </label>

              <p
                className={cx(
                  'tos',
                  { '-highlighted': this.state.showTOSWarning },
                  { 'is-hidden': this.props.downloaded }
                )}
              >
                <label htmlFor="tos_check">
                  <input
                    type="checkbox"
                    id="tos_check"
                    value={this.state.tos_check}
                    onChange={() => this.onFieldValueChanged('tos_check', !this.state.tos_check)}
                  />
                  &nbsp;* I agree to the&nbsp;
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="http://trase.earth/terms-of-use"
                  >
                    Terms of use
                  </a>{' '}
                  (required field).
                </label>
              </p>
              <label className="submit">
                <div className="download-button" onClick={() => this.sendForm()}>
                  <div
                    className={cx('form-submit-download', {
                      'is-hidden': this.props.downloaded
                    })}
                  >
                    <svg className="icon icon-download">
                      <use xlinkHref="#icon-download" />
                    </svg>
                    download data
                  </div>
                  <div
                    className={cx('form-submit-submit', {
                      'is-hidden': !this.props.downloaded
                    })}
                  >
                    Submit
                  </div>
                </div>
              </label>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

DataPortalForm.propTypes = {
  closeForm: PropTypes.func,
  formVisible: PropTypes.bool,
  downloadFile: PropTypes.func,
  downloaded: PropTypes.bool
};

export default DataPortalForm;
