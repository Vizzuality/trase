/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import _ from 'lodash';
import { GET_CSV_DATA_DOWNLOAD_FILE, GET_JSON_DATA_DOWNLOAD_FILE, getURLFromParams } from 'utils/getURLFromParams';
import BulkDownloadsBlock from 'react-components/data-portal/bulk-downloads-block.component';
import DownloadSelector from 'react-components/data-portal/download-selector.component';
import PropTypes from 'prop-types';
import DataPortalDisabledMessage from 'react-components/data-portal/data-portal-disabled-message.component';
import DataPortalForm from 'react-components/data-portal/data-portal-form.component';
import classnames from 'classnames';

class DataContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedContextId: null,
      formVisible: false,

      selectedCountry: null,
      selectedCommodity: null,
      selectedYears: [],
      selectedExporters: [],
      selectedConsumptionCountries: [],
      selectedIndicators: [],

      allYearsSelected: false,
      allExportersSelected: false,
      allConsumptionCountriesSelected: false,
      allIndicatorsSelected: false,

      outputType: 'pivot',
      fileExtension: '.csv',
      fileSeparator: 'comma',

      currentDownloadParams: null,
      currentDownloadType: null,

      downloaded: false
    };

    this.onClickEventHandler = this.onClickEventHandler.bind(this);
    this.onAllSelected = this.onAllSelected.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.onBulkDownloadClicked = this.onBulkDownloadClicked.bind(this);
  }

  onDownloadButtonClicked() {
    if (DATA_FORM_ENABLED) {
      this.setState({
        currentDownloadParams: null,
        currentDownloadType: 'custom'
      });
      this.showForm();
    } else {
      this.downloadFile();
    }
  }


  onBulkDownloadClicked(contextId) {
    if (DATA_FORM_ENABLED) {
      this.setState({
        currentDownloadParams: { context_id: contextId, pivot: 1 },
        currentDownloadType: 'bulk'
      });
      this.showForm();
    } else {
      this.downloadFile({ context_id: contextId, pivot: 1 });
    }
  }

  onOutputTypeSelected(outputType) {
    this.setState({ outputType });
  }

  onFileFormatSelected(fileExtension, fileSeparator) {
    this.setState({ fileExtension, fileSeparator });
  }

  onClickEventHandler(group, value = null) {
    switch (group) {
      case 'countries': {
        this.setState({ selectedCountry: value });
        break;
      }
      case 'commodities': {
        const selectedContext = this.props.contexts.find(elem =>
          elem.isDisabled !== true
          && elem.countryId === this.state.selectedCountry
          && elem.commodityId === value);
        this.setState({ selectedCommodity: value, selectedContextId: selectedContext.id });
        if (selectedContext) {
          this.props.onContextSelected(selectedContext.id);
        }
        break;
      }
      case 'years': {
        const selectedYears = _.xor(this.state.selectedYears, [value]);
        const selectedContext = this.props.contexts.find(context => context.id === this.state.selectedContextId);
        this.setState({ selectedYears, allYearsSelected: selectedYears.length === selectedContext.years.length });
        break;
      }
      case 'exporters': {
        const selectedExporters = _.xor(this.state.selectedExporters, [value]);
        this.setState({
          selectedExporters,
          allExportersSelected: selectedExporters.length === this.props.exporters.length
        });
        break;
      }
      case 'consumption-countries': {
        const selectedConsumptionCountries = _.xor(this.state.selectedConsumptionCountries, [value]);
        const allConsumptionCountriesSelected =
          selectedConsumptionCountries.length === this.props.consumptionCountries.length;
        this.setState({ selectedConsumptionCountries, allConsumptionCountriesSelected });
        break;
      }
      case 'indicators': {
        const selectedIndicators = _.xor(this.state.selectedIndicators, [value]);
        this.setState({
          selectedIndicators,
          allIndicatorsSelected: selectedIndicators.length === this.props.indicators.length
        });

        this.setState({ selectedIndicators: _.xor(this.state.selectedIndicators, [value]) });
        break;
      }
    }
  }

  onAllSelected(group) {
    switch (group) {
      case 'years': {
        if (this.state.allYearsSelected) {
          this.setState({
            selectedYears: [],
            allYearsSelected: !this.state.allYearsSelected
          });
        } else {
          const selectedContext = this.props.contexts.find(context => context.id === this.state.selectedContextId);
          this.setState({ selectedYears: selectedContext.years, allYearsSelected: !this.state.allYearsSelected });
        }
        break;
      }
      case 'exporters': {
        if (this.state.allExportersSelected) {
          this.setState({
            selectedExporters: [],
            allExportersSelected: !this.state.allExportersSelected
          });
        } else {
          this.setState({
            selectedExporters: this.props.exporters.map(elem => elem.id),
            allExportersSelected: !this.state.allExportersSelected
          });
        }
        break;
      }
      case 'consumption-countries': {
        if (this.state.allConsumptionCountriesSelected) {
          this.setState({
            selectedConsumptionCountries: [],
            allConsumptionCountriesSelected: !this.state.allConsumptionCountriesSelected
          });
        } else {
          this.setState({
            selectedConsumptionCountries: this.props.consumptionCountries.map(elem => elem.id),
            allConsumptionCountriesSelected: !this.state.allConsumptionCountriesSelected
          });
        }
        break;
      }
      case 'indicators': {
        if (this.state.allIndicatorsSelected) {
          this.setState({
            selectedIndicators: [],
            allIndicatorsSelected: !this.state.allIndicatorsSelected
          });
        } else {
          this.setState({
            selectedIndicators: this.props.indicators.map(elem => elem.name),
            allIndicatorsSelected: !this.state.allIndicatorsSelected
          });
        }
        break;
      }
    }
  }

  getDownloadURLParams() {
    if (this.state.selectedCommodity === null) {
      return [];
    }
    const contextId = this.state.selectedContextId;
    const file = this.state.fileExtension;
    const outputType = this.state.outputType;
    const params = {
      context_id: contextId
    };

    params.years = this.state.allYearsSelected ? [] : this.state.selectedYears;
    params.exporters_ids = this.state.allExportersSelected ? [] : this.state.selectedExporters;
    params.countries_ids = this.state.allConsumptionCountriesSelected ? [] : this.state.selectedConsumptionCountries;
    params.indicators = this.state.allIndicatorsSelected ? [] : this.state.selectedIndicators;

    if (file === '.csv') {
      params.separator = this.state.fileSeparator;
    }
    params[outputType] = 1;

    return params;
  }

  closeForm() {
    this.setState({ formVisible: false });
  }

  showForm() {
    this.props.onDataDownloadFormLoaded();
    this.setState({ formVisible: true, downloaded: false });
  }


  downloadFile(inputParams) {
    const params = inputParams || this.state.currentDownloadParams || this.getDownloadURLParams();

    if (!params.context_id) {
      return;
    }

    const file = this.state.fileExtension;
    let downloadURL;

    switch (file) {
      case '.json':
        downloadURL = getURLFromParams(GET_JSON_DATA_DOWNLOAD_FILE, params);
        break;
      default:
        downloadURL = getURLFromParams(GET_CSV_DATA_DOWNLOAD_FILE, params);
        break;
    }

    this.props.onDownloadTriggered(Object.assign({
      file,
      type: this.state.currentDownloadType
    }, params));

    window.open(downloadURL);

    this.setState({ downloaded: true });
  }

  render() {
    const { autoCompleteCountries, contexts, exporters, consumptionCountries, indicators } = this.props;

    const selectedContext = contexts.find(context => context.id === this.state.selectedContextId);

    const enabledContexts = contexts.filter(elem => elem.isDisabled !== true);

    const countryOptions = _.uniqBy(enabledContexts, context => context.countryId)
      .map(context => ({
        id: context.countryId,
        name: context.countryName.toLowerCase(),
        noSelfCancel: true
      }));


    const commodityOptions = contexts
      .filter(context => context.countryId === this.state.selectedCountry)
      .map(context => ({
        id: context.id,
        name: context.commodityName.toLowerCase(),
        noSelfCancel: false
      }));

    let yearOptions = [];
    if (selectedContext) {
      yearOptions = selectedContext.years.map(year => ({
        id: year,
        name: year,
        noSelfCancel: true
      }));
    }

    const exporterOptions = exporters.map(exporter => ({
      id: exporter.id,
      name: exporter.name.toLowerCase(),
      noSelfCancel: false
    }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const consumptionCountryOptions = consumptionCountries.map(country => ({
      id: country.id,
      name: country.name.toLowerCase(),
      noSelfCancel: false
    }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const indicatorOptions = indicators.map(indicator => ({
      id: indicator.name,
      name: `${indicator.frontendName}${indicator.unit !== null ? `(${indicator.unit})` : ''}`,
      noSelfCancel: false
    }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="l-data">
        {DATA_DOWNLOAD_ENABLED === false &&
        <DataPortalDisabledMessage />
        }
        <DataPortalForm
          autoCompleteCountries={autoCompleteCountries}
          formVisible={this.state.formVisible}
          closeForm={this.closeForm}
          downloadFile={this.downloadFile}
          downloaded={this.state.downloaded}
        />
        <div className="row">
          <div className="small-12 columns c-bulk-downloads-container">
            <BulkDownloadsBlock
              contexts={enabledContexts}
              enabled={DATA_DOWNLOAD_ENABLED}
              onButtonClicked={this.onBulkDownloadClicked}
            />
            <div className="c-custom-dataset">
              <div className="c-custom-dataset__title">CREATE A CUSTOM DATASET</div>
              <div className="row">
                <div className="small-9 columns">
                  <div className="row">
                    <div className="small-4 columns">
                      <DownloadSelector
                        enabled
                        options={countryOptions}
                        title="PRODUCTION COUNTRIES"
                        type="countries"
                        onOptionSelected={this.onClickEventHandler}
                        selected={[this.state.selectedCountry]}
                      />
                    </div>
                    <div className="small-4 columns">
                      <DownloadSelector
                        enabled={this.state.selectedCountry !== null}
                        options={commodityOptions}
                        title="COMMODITIES"
                        type="commodities"
                        onOptionSelected={this.onClickEventHandler}
                        disabledText="Please select first a country"
                        selected={[this.state.selectedCommodity]}
                      />
                    </div>
                    <div className="small-4 columns">
                      <DownloadSelector
                        allowMultiple
                        allSelected={this.state.allYearsSelected}
                        options={yearOptions}
                        enabled={this.state.selectedCountry !== null && this.state.selectedCommodity !== null}
                        title="YEARS"
                        type="years"
                        onOptionSelected={this.onClickEventHandler}
                        onAllSelected={this.onAllSelected}
                        disabledText="Please select first a country and commodity"
                        selected={this.state.selectedYears}
                      />
                    </div>
                    <div className="small-4 columns">
                      <DownloadSelector
                        allowMultiple
                        allSelected={this.state.allExportersSelected}
                        options={exporterOptions}
                        enabled={this.state.selectedCountry !== null && this.state.selectedCommodity !== null}
                        title="COMPANIES"
                        type="exporters"
                        onOptionSelected={this.onClickEventHandler}
                        onAllSelected={this.onAllSelected}
                        disabledText="Please select first a country and commodity"
                        selected={this.state.selectedExporters}
                      />
                    </div>
                    <div className="small-4 columns">
                      <DownloadSelector
                        allowMultiple
                        allSelected={this.state.allConsumptionCountriesSelected}
                        options={consumptionCountryOptions}
                        enabled={this.state.selectedCountry !== null && this.state.selectedCommodity !== null}
                        title="CONSUMPTION COUNTRIES"
                        type="consumption-countries"
                        onOptionSelected={this.onClickEventHandler}
                        onAllSelected={this.onAllSelected}
                        disabledText="Please select first a country and commodity"
                        selected={this.state.selectedConsumptionCountries}
                      />
                    </div>
                    <div className="small-4 columns">
                      <DownloadSelector
                        allowMultiple
                        allSelected={this.state.allIndicatorsSelected}
                        options={indicatorOptions}
                        enabled={this.state.selectedCountry !== null && this.state.selectedCommodity !== null}
                        title="INDICATORS"
                        type="indicators"
                        onOptionSelected={this.onClickEventHandler}
                        onAllSelected={this.onAllSelected}
                        disabledText="Please select first a country and commodity"
                        selected={this.state.selectedIndicators}
                      />
                    </div>
                  </div>
                </div>
                <div className="small-3 columns">
                  <div className="c-custom-dataset__format-sidebar">
                    <div
                      className="c-custom-dataset-selector"
                      data-type="format"
                    >
                      <div className="c-custom-dataset-selector__header">OUTPUT TYPE</div>
                      <ul className="c-custom-dataset-selector__values">
                        <li className="-selected">
                          Pivot
                          <div
                            className={classnames(
                              'c-radio-btn -no-self-cancel -grey',
                              { '-enabled': this.state.outputType === 'pivot' }
                            )}
                            onClick={() => this.onOutputTypeSelected('pivot')}
                          />
                        </li>
                        <li>
                          Table
                          <div
                            className={classnames(
                              'c-radio-btn -no-self-cancel -grey',
                              { '-enabled': this.state.outputType === 'table' }
                            )}
                            onClick={() => this.onOutputTypeSelected('table')}
                          />
                        </li>
                      </ul>
                    </div>

                    <div className="c-custom-dataset-selector" data-type="format">
                      <div className="c-custom-dataset-selector__header">FILE</div>
                      <ul className="c-custom-dataset-selector__values">
                        <li className="-selected">
                          .csv (comma separated)
                          <div
                            className={classnames(
                              'c-radio-btn -no-self-cancel -grey',
                              { '-enabled': this.state.fileExtension === '.csv'
                                && this.state.fileSeparator === 'comma' }
                            )}
                            onClick={() => this.onFileFormatSelected('.csv', 'comma')}
                          />
                        </li>
                        <li>
                          .csv (semicolon separated)
                          <div
                            className={classnames(
                              'c-radio-btn -no-self-cancel -grey',
                              {
                                '-enabled': this.state.fileExtension === '.csv'
                                && this.state.fileSeparator === 'semicolon'
                              }
                            )}
                            onClick={() => this.onFileFormatSelected('.csv', 'semicolon')}

                          />
                        </li>
                        <li>
                          .json
                          <div
                            className={classnames(
                              'c-radio-btn -no-self-cancel -grey',
                              { '-enabled': this.state.fileExtension === '.json' && this.state.fileSeparator === '' }
                            )}
                            onClick={() => this.onFileFormatSelected('.json', '')}

                          />
                        </li>
                      </ul>
                    </div>

                    <div
                      className={classnames(
                        'download-button',
                        {
                          '-disabled':
                          !DATA_DOWNLOAD_ENABLED ||
                          this.state.selectedCountry === null ||
                          this.state.selectedCommodity === null
                        }
                      )}
                      onClick={() => this.onDownloadButtonClicked()}
                    >
                      <svg className="icon icon-download">
                        <use xlinkHref="#icon-download" />
                      </svg>
                      DOWNLOAD DATA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

DataContent.defaultProps = {
  contexts: [],
  indicators: [],
  consumptionCountries: [],
  exporters: []
};

DataContent.propTypes = {
  autoCompleteCountries: PropTypes.string,
  contexts: PropTypes.array,
  consumptionCountries: PropTypes.array,
  exporters: PropTypes.array,
  indicators: PropTypes.array,
  onContextSelected: PropTypes.func,
  onDataDownloadFormLoaded: PropTypes.func,
  onDownloadTriggered: PropTypes.func
};

export default DataContent;
