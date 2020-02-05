/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import cx from 'classnames';
import xor from 'lodash/xor';
import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';

import {
  GET_CSV_DATA_DOWNLOAD_FILE_URL,
  GET_JSON_DATA_DOWNLOAD_FILE_URL,
  getURLFromParams
} from 'utils/getURLFromParams';
import BulkDownloadsBlock from 'react-components/data-portal/bulk-downloads-block/bulk-downloads-block.component';
import DownloadSelector from 'react-components/data-portal/download-selector.component';
import PropTypes from 'prop-types';
import DataPortalDisabledMessage from 'react-components/data-portal/data-portal-disabled-message.component';
import DataPortalForm from 'react-components/data-portal/data-portal-form/data-portal-form.component';
import RadioButton from 'react-components/shared/radio-button/radio-button.component';

class DataContent extends Component {
  constructor(props) {
    super(props);

    const selectedCountry = props.selectedContext ? props.selectedContext.countryId : null;

    // This may look weird but it is indeed intended behavior
    // This component's internal state uses the context id as the id of the commodity.
    const selectedCommodity = props.selectedContext ? props.selectedContext.id : null;

    this.state = {
      formVisible: false,

      selectedCountry,
      selectedCommodity,
      selectedYears: [],
      selectedExporters: [],
      selectedConsumptionCountries: [],
      selectedIndicators: [],
      selectedIndicatorsFilters: {},

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

    this.onOptionFilterChange = this.onOptionFilterChange.bind(this);
    this.onOptionFilterClear = this.onOptionFilterClear.bind(this);
    this.onClickEventHandler = this.onClickEventHandler.bind(this);
    this.onAllSelected = this.onAllSelected.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.onBulkDownloadClicked = this.onBulkDownloadClicked.bind(this);
  }

  componentDidMount() {
    const { selectedContext, onContextSelected } = this.props;

    if (selectedContext) {
      onContextSelected(selectedContext.id);
    }

    if (!DATA_DOWNLOAD_ENABLED) {
      document.querySelector('body').classList.add('-overflow-hidden');
    }
  }

  componentWillUnmount() {
    if (!DATA_DOWNLOAD_ENABLED) {
      document.querySelector('body').classList.remove('-overflow-hidden');
    }
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

  onOptionFilterChange(filter) {
    this.setState(state => {
      const selectedIndicators = union(state.selectedIndicators, [filter.name]);

      const { indicators } = this.props;

      return {
        selectedIndicators,
        allIndicatorsSelected: selectedIndicators.length === indicators.length,
        selectedIndicatorsFilters: {
          ...state.selectedIndicatorsFilters,
          [filter.name]: filter
        }
      };
    });
  }

  onOptionFilterClear(filterName) {
    this.setState(state => {
      const selectedIndicatorsFilters = { ...state.selectedIndicatorsFilters };
      delete selectedIndicatorsFilters[filterName];
      return { selectedIndicatorsFilters };
    });
  }

  onOutputTypeSelected(outputType) {
    this.setState({ outputType });
  }

  onFileFormatSelected(fileExtension, fileSeparator) {
    this.setState({ fileExtension, fileSeparator });
  }

  onClickEventHandler(group, value = null) {
    const {
      selectedExporters,
      selectedYears,
      selectedConsumptionCountries,
      selectedIndicators,
      selectedIndicatorsFilters
    } = this.state;
    const { selectedContext, contexts, exporters, consumptionCountries, indicators } = this.props;

    switch (group) {
      case 'countries': {
        this.setState({ selectedCountry: value });
        break;
      }
      case 'commodities': {
        const newSelectedContext = contexts.find(
          elem => elem.isDisabled !== true && elem.id === value
        );
        this.setState({ selectedCommodity: value });
        if (newSelectedContext) {
          this.props.onContextSelected(newSelectedContext.id);
        }
        break;
      }
      case 'years': {
        const newSelectedYears = xor(selectedYears, [value]);
        this.setState({
          selectedYears: newSelectedYears,
          allYearsSelected: newSelectedYears.length === selectedContext.years.length
        });
        break;
      }
      case 'exporters': {
        const newSelectedExporters = xor(selectedExporters, [value]);
        this.setState({
          selectedExporters: newSelectedExporters,
          allExportersSelected: newSelectedExporters.length === exporters.length
        });
        break;
      }
      case 'consumption-countries': {
        const newSelectedConsumptionCountries = xor(selectedConsumptionCountries, [value]);
        const allConsumptionCountriesSelected =
          selectedConsumptionCountries.length === consumptionCountries.length;
        this.setState({
          selectedConsumptionCountries: newSelectedConsumptionCountries,
          allConsumptionCountriesSelected
        });
        break;
      }
      case 'indicators': {
        const newSelectedIndicators = xor(selectedIndicators, [value]);
        const newSelectedIndicatorsFilters = { ...selectedIndicatorsFilters };

        if (!newSelectedIndicators.includes(value)) {
          delete newSelectedIndicatorsFilters[value];
        }

        this.setState({
          selectedIndicators: newSelectedIndicators,
          selectedIndicatorsFilters: newSelectedIndicatorsFilters,
          allIndicatorsSelected: newSelectedIndicators.length === indicators.length
        });
        break;
      }
    }
  }

  onAllSelected(group) {
    const {
      allYearsSelected,
      allExportersSelected,
      allConsumptionCountriesSelected,
      allIndicatorsSelected
    } = this.state;
    const { indicators, consumptionCountries, selectedContext } = this.props;

    switch (group) {
      case 'years': {
        if (allYearsSelected) {
          this.setState({
            selectedYears: [],
            allYearsSelected: !allYearsSelected
          });
        } else {
          this.setState({
            selectedYears: selectedContext.years,
            allYearsSelected: !allYearsSelected
          });
        }
        break;
      }
      case 'exporters': {
        if (allExportersSelected) {
          this.setState({
            selectedExporters: [],
            allExportersSelected: !allExportersSelected
          });
        } else {
          this.setState({
            selectedExporters: this.props.exporters.map(elem => elem.id),
            allExportersSelected: !allExportersSelected
          });
        }
        break;
      }
      case 'consumption-countries': {
        if (allConsumptionCountriesSelected) {
          this.setState({
            selectedConsumptionCountries: [],
            allConsumptionCountriesSelected: !allConsumptionCountriesSelected
          });
        } else {
          this.setState({
            selectedConsumptionCountries: consumptionCountries.map(elem => elem.id),
            allConsumptionCountriesSelected: !allConsumptionCountriesSelected
          });
        }
        break;
      }
      case 'indicators': {
        if (allIndicatorsSelected) {
          this.setState({
            selectedIndicators: [],
            selectedIndicatorsFilters: {},
            allIndicatorsSelected: !allIndicatorsSelected
          });
        } else {
          this.setState({
            selectedIndicators: indicators.map(elem => elem.name),
            allIndicatorsSelected: !allIndicatorsSelected
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
    const contextId = this.props.selectedContext.id;
    const file = this.state.fileExtension;
    const { outputType } = this.state;
    const params = {
      context_id: contextId
    };

    params.years = this.state.allYearsSelected ? [] : this.state.selectedYears;
    params.e_ids = this.state.allExportersSelected ? [] : this.state.selectedExporters;
    params.c_ids = this.state.allConsumptionCountriesSelected
      ? []
      : this.state.selectedConsumptionCountries;
    params.filters = this.getIndicatorFilters();

    if (file === '.csv') {
      params.separator = this.state.fileSeparator;
    }
    params[outputType] = 1;

    return params;
  }

  getIndicatorFilters() {
    const { allIndicatorsSelected, selectedIndicators, selectedIndicatorsFilters } = this.state;
    const indicators = allIndicatorsSelected ? [] : selectedIndicators;

    return indicators.map(indicator => selectedIndicatorsFilters[indicator] || { name: indicator });
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
    const fileUrl =
      file === '.json' ? GET_JSON_DATA_DOWNLOAD_FILE_URL : GET_CSV_DATA_DOWNLOAD_FILE_URL;
    const downloadURL = getURLFromParams(fileUrl, params);

    this.props.onDownloadTriggered(
      Object.assign(
        {
          file,
          type: this.state.currentDownloadType
        },
        params
      )
    );

    window.open(downloadURL);

    this.setState({ downloaded: true });
  }

  render() {
    const {
      autoCompleteCountries,
      contexts,
      exporters,
      consumptionCountries,
      indicators,
      selectedContext
    } = this.props;

    const enabledContexts = contexts.filter(elem => elem.isDisabled !== true);

    const countryOptions = uniqBy(enabledContexts, context => context.countryId).map(context => ({
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

    const exporterOptions = exporters
      .map(exporter => ({
        id: exporter.id,
        name: exporter.name.toLowerCase(),
        noSelfCancel: false
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const consumptionCountryOptions = consumptionCountries
      .map(country => ({
        id: country.id,
        name: country.name.toLowerCase(),
        noSelfCancel: false
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const indicatorOptions = indicators
      .map(indicator => ({
        id: indicator.name,
        name: `${indicator.frontendName}${indicator.unit !== null ? `(${indicator.unit})` : ''}`,
        unit: indicator.unit,
        noSelfCancel: false,
        filterName: indicator.frontendName,
        filterOptions: indicator.filterOptions
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="l-data">
        {DATA_DOWNLOAD_ENABLED === false && <DataPortalDisabledMessage />}
        <DataPortalForm
          autoCompleteCountries={autoCompleteCountries}
          isFormVisible={this.state.formVisible}
          closeForm={this.closeForm}
          downloadFile={this.downloadFile}
          downloaded={this.state.downloaded}
        />
        <div className="row column">
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
                      enabled={
                        this.state.selectedCountry !== null && this.state.selectedCommodity !== null
                      }
                      title="YEARS"
                      type="years"
                      onOptionSelected={this.onClickEventHandler}
                      onAllSelected={this.onAllSelected}
                      disabledText="Please select first a country and commodity"
                      selected={this.state.selectedYears}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="small-4 columns">
                    <DownloadSelector
                      allowMultiple
                      allSelected={this.state.allExportersSelected}
                      options={exporterOptions}
                      enabled={
                        this.state.selectedCountry !== null && this.state.selectedCommodity !== null
                      }
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
                      enabled={
                        this.state.selectedCountry !== null && this.state.selectedCommodity !== null
                      }
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
                      enabled={
                        this.state.selectedCountry !== null && this.state.selectedCommodity !== null
                      }
                      title="INDICATORS"
                      type="indicators"
                      selectedFilters={this.state.selectedIndicatorsFilters}
                      onOptionSelected={this.onClickEventHandler}
                      onOptionFilterChange={this.onOptionFilterChange}
                      onOptionFilterClear={this.onOptionFilterClear}
                      onAllSelected={this.onAllSelected}
                      disabledText="Please select first a country and commodity"
                      selected={this.state.selectedIndicators}
                    />
                  </div>
                </div>
              </div>
              <div className="small-3 columns">
                <div className="c-custom-dataset__format-sidebar">
                  <div className="c-custom-dataset-selector" data-type="format">
                    <div className="c-custom-dataset-selector__header">OUTPUT TYPE</div>
                    <ul className="c-custom-dataset-selector__values">
                      <li className="-selected">
                        Pivot
                        <RadioButton
                          noSelfCancel
                          className="-grey"
                          enabled={this.state.outputType === 'pivot'}
                          onClick={() => this.onOutputTypeSelected('pivot')}
                        />
                      </li>
                      <li>
                        Table
                        <RadioButton
                          noSelfCancel
                          className="-grey"
                          enabled={this.state.outputType === 'table'}
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
                        <RadioButton
                          noSelfCancel
                          className="-grey"
                          enabled={
                            this.state.fileExtension === '.csv' &&
                            this.state.fileSeparator === 'comma'
                          }
                          onClick={() => this.onFileFormatSelected('.csv', 'comma')}
                        />
                      </li>
                      <li>
                        .csv (semicolon separated)
                        <RadioButton
                          noSelfCancel
                          className="-grey"
                          enabled={
                            this.state.fileExtension === '.csv' &&
                            this.state.fileSeparator === 'semicolon'
                          }
                          onClick={() => this.onFileFormatSelected('.csv', 'semicolon')}
                        />
                      </li>
                      <li>
                        .json
                        <RadioButton
                          noSelfCancel
                          className="-grey"
                          enabled={
                            this.state.fileExtension === '.json' && this.state.fileSeparator === ''
                          }
                          onClick={() => this.onFileFormatSelected('.json', '')}
                        />
                      </li>
                    </ul>
                  </div>

                  <div
                    className={cx('download-button', {
                      '-disabled':
                        !DATA_DOWNLOAD_ENABLED ||
                        this.state.selectedCountry === null ||
                        this.state.selectedCommodity === null
                    })}
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
  onDownloadTriggered: PropTypes.func,
  selectedContext: PropTypes.object
};

export default DataContent;
