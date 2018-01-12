import {
  GET_CSV_DATA_DOWNLOAD_FILE, GET_JSON_DATA_DOWNLOAD_FILE, getURLFromParams,
  POST_SUBSCRIBE_NEWSLETTER
} from 'utils/getURLFromParams';
import SelectorItemsTemplate from 'templates/data/selector-items.ejs';
import _ from 'lodash';
import BulkDownloadsBlock from 'react-components/data/bulk-downloads-block.component';
import React from 'react';
import { render } from 'react-dom';

export default class {
  onCreated() {
    this._setVars();
    this.downloadButton.addEventListener('click', () => {
      this.currentDownloadParams = null;
      this.currentDownloadType = 'custom';
      if (DATA_FORM_ENABLED) {
        this._showForm();
      } else {
        this._downloadFile();
      }
    });
    this.formSubmitButton.addEventListener('click', () => {
      this._sendForm();
    });
    this.formVeil.addEventListener('click', () => {
      this._closeForm();
    });
    this.onClickEventHandler = this._onToggleRadio.bind(this);
  }

  _setVars() {
    this.el = document.querySelector('.c-custom-dataset');
    this.downloadButton = this.el.querySelector('.js-custom-dataset-download-button');
    this.selectorCountries = this.el.querySelector('.js-custom-dataset-selector-countries');
    this.selectorCommodities = this.el.querySelector('.js-custom-dataset-selector-commodities');
    this.selectorYears = this.el.querySelector('.js-custom-dataset-selector-years');
    this.selectorCompanies = this.el.querySelector('.js-custom-dataset-selector-companies');
    this.selectorConsumptionCountries = this.el.querySelector('.js-custom-dataset-selector-consumption-countries');
    this.selectorIndicators = this.el.querySelector('.js-custom-dataset-selector-indicators');
    this.selectorOutputType = this.el.querySelector('.js-custom-dataset-selector-output-type');
    this.selectorFormatting = this.el.querySelector('.js-custom-dataset-selector-formatting');
    this.selectorFile = this.el.querySelector('.js-custom-dataset-selector-file');
    this.bulkDownloadsSection = document.querySelector('.c-bulk-downloads-container');
    this.formContainer = document.querySelector('.js-form-container');
    this.formSubmitButton = document.querySelector('.js-form-submit');
    this.form = document.querySelector('.js-form');
    this.formVeil = document.querySelector('.js-form-veil');
    this.formMissing = document.querySelector('.js-missing');
    this.formTos = document.querySelector('.js-tos');
    this.formTosCheck = document.querySelector('#tos_check');
  }

  fillContexts(contexts) {
    this.contexts = contexts;

    const enabledContexts = contexts.filter(elem => elem.isDisabled !== true);

    const items = _.uniqBy(enabledContexts, context => context.countryId).map(context => ({
      id: context.countryId,
      name: context.countryName.toLowerCase(),
      group: 'countries',
      noSelfCancel: true
    }));

    render(
      <BulkDownloadsBlock
        contexts={enabledContexts}
        enabled={DATA_DOWNLOAD_ENABLED}
        onButtonClicked={(contextId) => {
          this.currentDownloadParams = { context_id: contextId, pivot: 1 };
          this.currentDownloadType = 'bulk';
          if (DATA_FORM_ENABLED) {
            this._showForm();
          } else {
            this._downloadFile();
          }
        }}
      />,
      this.bulkDownloadsSection
    );

    this.selectorCountries.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorCountries);
    this._setSelectorEvents(this.selectorOutputType);
    this._setSelectorEvents(this.selectorFormatting);
    this._setSelectorEvents(this.selectorFile);
  }

  fillExporters(exporters) {
    const items = exporters.map(exporter => ({
      id: exporter.id,
      name: exporter.name.toLowerCase(),
      group: 'companies',
      noSelfCancel: false
    }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.selectorCompanies.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorCompanies);
  }

  fillConsumptionCountries(consumptionCountries) {
    const items = consumptionCountries.map(country => ({
      id: country.id,
      name: country.name.toLowerCase(),
      group: 'consumption-countries',
      noSelfCancel: false
    }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this
      .selectorConsumptionCountries
      .querySelector('.js-custom-dataset-selector-values')
      .innerHTML = SelectorItemsTemplate({ items });
    this._setSelectorEvents(this.selectorConsumptionCountries);
  }

  fillIndicators(indicators) {
    const items = indicators.map(indicator => ({
      id: indicator.name,
      name: `${indicator.frontendName}${indicator.unit !== null ? `(${indicator.unit})` : ''}`,
      group: 'indicators',
      noSelfCancel: false
    }))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.selectorIndicators.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorIndicators);
  }

  _getDownloadURLParams() {
    if (this.selectorCommodities.querySelector('.c-radio-btn.-enabled') === null) {
      return [];
    }
    const contextId = this.selectorCommodities.querySelector('.c-radio-btn.-enabled').getAttribute('value');
    const fileRadio = this.selectorFile.querySelector('.c-radio-btn.-enabled');
    const file = fileRadio.getAttribute('value');
    const outputType = this.selectorOutputType.querySelector('.c-radio-btn.-enabled').getAttribute('value');
    const params = {
      context_id: contextId
    };

    const years = Array.prototype.slice.call(
      this.selectorYears.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn.-enabled')
      , 0
    );
    if (years.length > 0) {
      params.years = years.map(item => item.getAttribute('value'));
    }
    const exporters = Array.prototype.slice.call(
      this.selectorCompanies
        .querySelector('.js-custom-dataset-selector-values')
        .querySelectorAll('.c-radio-btn.-enabled')
      , 0
    );
    if (exporters.length > 0) {
      params.exporters_ids = exporters.map(item => item.getAttribute('value'));
    }
    const consumptionCountries = Array.prototype.slice.call(
      this.selectorConsumptionCountries
        .querySelector('.js-custom-dataset-selector-values')
        .querySelectorAll('.c-radio-btn.-enabled')
      , 0
    );
    if (consumptionCountries.length > 0) {
      params.countries_ids = consumptionCountries.map(item => item.getAttribute('value'));
    }
    const indicators = Array.prototype.slice.call(
      this.selectorIndicators
        .querySelector('.js-custom-dataset-selector-values')
        .querySelectorAll('.c-radio-btn.-enabled')
      , 0
    );
    if (indicators.length > 0) {
      params.indicators = indicators.map(item => item.getAttribute('value'));
    }
    if (file === '.csv') {
      params.separator = fileRadio.getAttribute('data-separator-type');
    }
    params[outputType] = 1;

    return params;
  }

  _showForm() {
    this.callbacks.onDataDownloadFormLoaded();
    this._setFormStatus(false);
    this.formContainer.classList.remove('is-hidden');
  }

  _closeForm() {
    this.formContainer.classList.add('is-hidden');
  }

  _sendForm() {
    const payload = {};
    for (let i = 0; i < this.form.length; i++) {
      const formEl = this.form.elements[i];
      payload[formEl.id] = formEl.value;
    }

    if (!this.formTosCheck.checked) {
      this.formTos.classList.add('-highlighted');
      return;
    }

    delete payload.country_alt;
    delete payload.tos_check;
    payload.date = new Date().toString();

    if (!this.downloaded) {
      this._downloadFile();
    }

    // pretty please can I haz your data
    if (_.values(payload).filter(v => v !== '').length === 1) {
      this._setFormStatus(true);
      return;
    }

    const dataSubmitBody = new FormData();
    Object.keys(payload).forEach((key) => {
      dataSubmitBody.append(key, payload[key]);
    });

    fetch(DATA_FORM_ENDPOINT, {
      method: 'POST',
      body: dataSubmitBody
    });


    const newsletterSubscribeBody = new FormData();
    newsletterSubscribeBody.append('email', payload.email);

    fetch(getURLFromParams(POST_SUBSCRIBE_NEWSLETTER), {
      method: 'POST',
      body: newsletterSubscribeBody
    });

    this._closeForm();
  }

  _setFormStatus(downloaded) {
    this.downloaded = downloaded;
    this.formMissing.classList.toggle('is-hidden', !downloaded);
    this.form.classList.toggle('-downloaded', downloaded);
  }

  _downloadFile() {
    const params = this.currentDownloadParams || this._getDownloadURLParams();

    if (!params.context_id) {
      return;
    }

    const fileRadio = this.selectorFile.querySelector('.c-radio-btn.-enabled');
    const file = fileRadio.getAttribute('value');
    let downloadURL;

    switch (file) {
      case '.json':
        downloadURL = getURLFromParams(GET_JSON_DATA_DOWNLOAD_FILE, params);
        break;
      default:
        downloadURL = getURLFromParams(GET_CSV_DATA_DOWNLOAD_FILE, params);
        break;
    }

    this.callbacks.onDownloadTriggered(Object.assign({
      file,
      type: this.currentDownloadType
    }, params));

    window.open(downloadURL);
  }

  _setSelectorEvents(selector) {
    const radios = Array.prototype.slice.call(selector.querySelectorAll('.c-radio-btn'), 0);
    radios.forEach((radio) => {
      radio.removeEventListener('click', this.onClickEventHandler);
      radio.addEventListener('click', this.onClickEventHandler);
    });
  }

  _unlockDownloadButton() {
    if (DATA_DOWNLOAD_ENABLED) {
      this.downloadButton.classList.remove('-disabled');
    }
  }

  _lockDownloadButton() {
    this.downloadButton.classList.add('-disabled');
  }

  _onToggleRadio(e) {
    const selectedRadio = e && e.currentTarget;
    if (!selectedRadio) {
      return;
    }
    const container = selectedRadio.closest('li');
    const value = selectedRadio.getAttribute('value');
    const group = selectedRadio.getAttribute('data-group');
    const allClosest = this.el.querySelector(`.c-radio-btn[data-group="${group}-all"]`);
    const isEnabled = selectedRadio.classList.contains('-enabled');

    switch (group) {
      case 'countries':
        this._cleanRadios(this.selectorCountries);
        this._cleanAllSelectorRadios();
        this._updateCommoditiesSelector(value);
        this._lockDownloadButton();
        break;
      case 'commodities':
        this._cleanRadios(this.selectorCommodities);
        this._cleanAllSelectorRadios();
        this.callbacks.onContextSelected(value);
        this._updateYearsSelector(value);
        if (isEnabled) {
          this._lockDownloadButton();
        } else {
          this._unlockDownloadButton();
        }
        break;
      case 'years':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'years-all':
        if (this.selectorYears.classList.contains('-disabled')) {
          return;
        }
        if (isEnabled) {
          this._cleanRadios(this.selectorYears);
        } else {
          this._selectAllRadios(this.selectorYears);
        }
        break;
      case 'companies':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'companies-all':
        if (this.selectorCompanies.classList.contains('-disabled')) {
          return;
        }
        if (isEnabled) {
          this._cleanRadios(this.selectorCompanies);
        } else {
          this._selectAllRadios(this.selectorCompanies);
        }
        break;
      case 'consumption-countries':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'consumption-countries-all':
        if (this.selectorConsumptionCountries.classList.contains('-disabled')) {
          return;
        }
        if (isEnabled) {
          this._cleanRadios(this.selectorConsumptionCountries);
        } else {
          this._selectAllRadios(this.selectorConsumptionCountries);
        }
        break;
      case 'indicators':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'indicators-all':
        if (this.selectorIndicators.classList.contains('-disabled')) {
          return;
        }
        if (isEnabled) {
          this._cleanRadios(this.selectorIndicators);
        } else {
          this._selectAllRadios(this.selectorIndicators);
        }
        break;
      case 'output-type':
        this._cleanRadios(this.selectorOutputType);
        break;
      case 'formatting':
        this._cleanRadios(this.selectorFormatting);
        break;
      case 'file':
        this._cleanRadios(this.selectorFile);
        break;
    }
    selectedRadio.classList.toggle('-enabled');
    container.classList.toggle('-selected');
    this._checkDependentSelectors();

    // Handle logic post status change on the clicked selector
    switch (group) {
      case 'year': {
        this._updateSelectAll(this.selectorYears);
        break;
      }
      case 'companies': {
        this._updateSelectAll(this.selectorCompanies);
        break;
      }
      case 'consumption-countries': {
        this._updateSelectAll(this.selectorConsumptionCountries);
        break;
      }
      case 'indicators': {
        this._updateSelectAll(this.selectorIndicators);
        break;
      }
    }
  }

  _updateSelectAll(selector) {
    const allSelector = selector.querySelector('[value="all"]');
    if (
      Array.prototype.slice.call(
        selector
          .querySelector('.js-custom-dataset-selector-values')
          .querySelectorAll('.c-radio-btn:not(.-enabled)')
        , 0
      ).length !== 0
    ) {
      allSelector.classList.remove('-enabled');
    } else {
      allSelector.classList.add('-enabled');
    }
  }

  _cleanAllSelectorRadios() {
    const radios = Array.prototype.slice.call(document.querySelectorAll('.c-radio-btn[value="all"]'), 0);
    radios.forEach((radio) => {
      radio.classList.remove('-enabled');
      radio.closest('li').classList.remove('-selected');
    });
  }

  _cleanRadios(selector) {
    const radios = Array.prototype.slice.call(
      selector
        .querySelector('.js-custom-dataset-selector-values')
        .querySelectorAll('.c-radio-btn')
      , 0
    );
    radios.forEach((radio) => {
      radio.classList.remove('-enabled');
      radio.closest('li').classList.remove('-selected');
    });
  }

  _checkDependentSelectors() {
    const countryRadio = this.selectorCountries.querySelector('.c-radio-btn.-enabled');
    const commodityRadio = this.selectorCommodities.querySelector('.c-radio-btn.-enabled');
    if (countryRadio !== null && commodityRadio !== null) {
      this._showDependentSelectors();
    } else {
      this._hideDependentSelectors();
    }
  }

  _showDependentSelectors() {
    this.selectorYears.classList.remove('-disabled');
    this.selectorCompanies.classList.remove('-disabled');
    this.selectorConsumptionCountries.classList.remove('-disabled');
    this.selectorIndicators.classList.remove('-disabled');
  }

  _hideDependentSelectors() {
    this.selectorYears.classList.add('-disabled');
    this.selectorCompanies.classList.add('-disabled');
    this.selectorConsumptionCountries.classList.add('-disabled');
    this.selectorIndicators.classList.add('-disabled');
  }

  _selectAllRadios(selector) {
    const radios = Array.prototype.slice.call(
      selector.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn:not(.-disabled)')
      , 0
    );
    radios.forEach((radio) => {
      radio.classList.add('-enabled');
      radio.closest('li').classList.add('-selected');
    });
  }

  _updateCommoditiesSelector(country) {
    const items = this.contexts
      .filter(context => context.countryId === parseInt(country, 10))
      .map(context => ({
        id: context.id,
        name: context.commodityName.toLowerCase(),
        group: 'commodities',
        noSelfCancel: false
      }));
    this.selectorCommodities.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this.selectorCommodities.classList.remove('-disabled');
    this._setSelectorEvents(this.selectorCommodities);
  }

  _updateYearsSelector(contextId) {
    const selectedContext = this.contexts.find(context => context.id === parseInt(contextId, 10));

    const items = selectedContext.years.map(year => ({
      id: year,
      name: year,
      group: 'year',
      noSelfCancel: true
    }));

    this.selectorYears.querySelector('.c-custom-dataset-selector__values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorYears);
  }
}
