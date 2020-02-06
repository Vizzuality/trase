import React from 'react';
import PropTypes from 'prop-types';
import DownloadSelector from 'react-components/data-portal/download-selector.component';

function CustomDownload(props) {
  const {
    dataPortalDispatch,
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
            onOptionSelected={payload => dataPortalDispatch({ type: 'selectCountry', payload })}
            selected={[selectedCountry]}
          />
        </div>
        <div className="small-4 columns">
          <DownloadSelector
            enabled={selectedCountry !== null}
            options={commodityOptions}
            title="COMMODITIES"
            onOptionSelected={payload => dataPortalDispatch({ type: 'selectCommodity', payload })}
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
            onOptionSelected={payload => dataPortalDispatch({ type: 'selectYears', payload })}
            onAllSelected={() => dataPortalDispatch({ type: 'selectAllYears' })}
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
            onOptionSelected={payload => dataPortalDispatch({ type: 'selectExporters', payload })}
            onAllSelected={() => dataPortalDispatch({ type: 'selectAllExporters' })}
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
            onOptionSelected={payload =>
              dataPortalDispatch({ type: 'selectConsumptionCountries', payload })
            }
            onAllSelected={() => dataPortalDispatch({ type: 'selectAllConsumptionCountries' })}
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
            onOptionSelected={payload => dataPortalDispatch({ type: 'selectIndicators', payload })}
            onOptionFilterChange={payload =>
              dataPortalDispatch({ type: 'optionFilterChange', payload })
            }
            onOptionFilterClear={() => dataPortalDispatch({ type: 'optionFilterClear' })}
            onAllSelected={() => dataPortalDispatch({ type: 'selectAllIndicators' })}
            disabledText="Please select first a country and commodity"
            selected={selectedIndicators}
          />
        </div>
      </div>
    </div>
  );
}

CustomDownload.propTypes = {
  dataPortalDispatch: PropTypes.func.isRequired,
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
