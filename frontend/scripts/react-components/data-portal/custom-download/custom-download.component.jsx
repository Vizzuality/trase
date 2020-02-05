import React from 'react';
import PropTypes from 'prop-types';
import DownloadSelector from 'react-components/data-portal/download-selector.component';

function CustomDownload(props) {
  const {
    dispatch,
    consumptionCountryOptions,
    selectedExporters,
    exporterOptions,
    selectedYears,
    yearOptions,
    commodityOptions,
    countryOptions,
    selectedCountry,
    selectedCommodity,
    allYearsSelected,
    allExportersSelected,
    allConsumptionCountriesSelected,
    allIndicatorsSelected,
    selectedConsumptionCountries,
    indicatorOptions,
    selectedIndicatorsFilters,
    selectedIndicators
  } = props;
  return (
    <div className="c-custom-download">
      <div className="row">
        <div className="small-4 columns">
          <DownloadSelector
            enabled
            options={countryOptions}
            title="PRODUCTION COUNTRIES"
            onOptionSelected={payload => dispatch({ type: 'selectCountry', payload })}
            selected={[selectedCountry]}
          />
        </div>
        <div className="small-4 columns">
          <DownloadSelector
            enabled={selectedCountry !== null}
            options={commodityOptions}
            title="COMMODITIES"
            onOptionSelected={payload => dispatch({ type: 'selectCommodity', payload })}
            disabledText="Please select first a country"
            selected={[selectedCommodity]}
          />
        </div>
        <div className="small-4 columns">
          <DownloadSelector
            allowMultiple
            allSelected={allYearsSelected}
            options={yearOptions}
            enabled={selectedCountry !== null && selectedCommodity !== null}
            title="YEARS"
            onOptionSelected={payload => dispatch({ type: 'selectYears', payload })}
            onAllSelected={() => dispatch({ type: 'selectAllYears' })}
            disabledText="Please select first a country and commodity"
            selected={selectedYears}
          />
        </div>
      </div>
      <div className="row">
        <div className="small-4 columns">
          <DownloadSelector
            allowMultiple
            allSelected={allExportersSelected}
            options={exporterOptions}
            enabled={selectedCountry !== null && selectedCommodity !== null}
            title="COMPANIES"
            onOptionSelected={payload => dispatch({ type: 'selectExporters', payload })}
            onAllSelected={() => dispatch({ type: 'selectAllExporters' })}
            disabledText="Please select first a country and commodity"
            selected={selectedExporters}
          />
        </div>
        <div className="small-4 columns">
          <DownloadSelector
            allowMultiple
            allSelected={allConsumptionCountriesSelected}
            options={consumptionCountryOptions}
            enabled={selectedCountry !== null && selectedCommodity !== null}
            title="CONSUMPTION COUNTRIES"
            onOptionSelected={payload => dispatch({ type: 'selectConsumptionCountries', payload })}
            onAllSelected={() => dispatch({ type: 'selectAllConsumptionCountries' })}
            disabledText="Please select first a country and commodity"
            selected={selectedConsumptionCountries}
          />
        </div>
        <div className="small-4 columns">
          <DownloadSelector
            allowMultiple
            allSelected={allIndicatorsSelected}
            options={indicatorOptions}
            enabled={selectedCountry !== null && selectedCommodity !== null}
            title="INDICATORS"
            selectedFilters={selectedIndicatorsFilters}
            onOptionSelected={payload => dispatch({ type: 'selectIndicators', payload })}
            onOptionFilterChange={payload => dispatch({ type: 'optionFilterChange', payload })}
            onOptionFilterClear={() => dispatch({ type: 'optionFilterClear' })}
            onAllSelected={() => dispatch({ type: 'selectAllIndicators' })}
            disabledText="Please select first a country and commodity"
            selected={selectedIndicators}
          />
        </div>
      </div>
    </div>
  );
}

CustomDownload.propTypes = {
  dispatch: PropTypes.func.isRequired,
  consumptionCountryOptions: PropTypes.array.isRequired,
  selectedExporters: PropTypes.array.isRequired,
  exporterOptions: PropTypes.array.isRequired,
  selectedYears: PropTypes.array.isRequired,
  yearOptions: PropTypes.array.isRequired,
  commodityOptions: PropTypes.array.isRequired,
  countryOptions: PropTypes.array.isRequired,
  selectedCountry: PropTypes.number.isRequired,
  selectedCommodity: PropTypes.number.isRequired,
  allYearsSelected: PropTypes.bool.isRequired,
  allExportersSelected: PropTypes.bool.isRequired,
  allConsumptionCountriesSelected: PropTypes.bool.isRequired,
  allIndicatorsSelected: PropTypes.bool.isRequired,
  selectedConsumptionCountries: PropTypes.array.isRequired,
  indicatorOptions: PropTypes.array.isRequired,
  selectedIndicatorsFilters: PropTypes.array.isRequired,
  selectedIndicators: PropTypes.array.isRequired
};

export default CustomDownload;
