import React, { useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import DataPortalDisabledMessage from 'react-components/data-portal/data-portal-disabled-message.component';
import DataPortalForm from 'react-components/data-portal/data-portal-form/data-portal-form.component';
import BulkDownloadsBlock from 'react-components/data-portal/bulk-downloads-block/bulk-downloads-block.component';
import FormatSidebar from 'react-components/data-portal/format-sidebar.component';
import CustomDownload from 'react-components/data-portal/custom-download/custom-download.container';
import union from 'lodash/union';
import xor from 'lodash/xor';
import {
  GET_CSV_DATA_DOWNLOAD_FILE_URL,
  GET_JSON_DATA_DOWNLOAD_FILE_URL,
  getURLFromParams
} from 'utils/getURLFromParams';

const initialState = {
  formVisible: false,
  selectedCountry: null,
  selectedCommodity: null,
  selectedYears: [],
  selectedExporters: [],
  selectedConsumptionCountries: [],
  selectedIndicators: [],
  selectedIndicatorsFilters: {},
  outputType: 'pivot',
  fileExtension: '.csv',
  fileSeparator: 'comma',
  downloadType: null,
  downloaded: false
};

function DataPortal(props) {
  const {
    loadContextNodes,
    autoCompleteCountries,
    enabledContexts,
    consumptionCountries,
    exporters,
    indicators,
    onContextSelected,
    onDataDownloadFormLoaded,
    onDownloadTriggered,
    selectedContext
  } = props;
  function reducer(state, action) {
    switch (action.type) {
      case 'setForm':
        return { ...state, formVisible: action.payload };
      case 'setDownloadType':
        return { ...state, downloadType: action.payload, formVisible: true, downloaded: false };
      case 'selectAllYears': {
        const allYearsSelected = state.selectedYears.length === selectedContext?.years.length;
        if (allYearsSelected) {
          return {
            ...state,
            selectedYears: []
          };
        }
        return {
          ...state,
          selectedYears: selectedContext.years
        };
      }
      case 'selectAllExporters': {
        const allExportersSelected = state.selectedExporters.length === exporters.length;
        if (allExportersSelected) {
          return {
            ...state,
            selectedExporters: []
          };
        }
        return {
          ...state,
          selectedExporters: exporters.map(elem => elem.id)
        };
      }
      case 'selectAllConsumptionCountries': {
        const allConsumptionCountriesSelected =
          state.selectedConsumptionCountries.length === consumptionCountries.length;
        if (allConsumptionCountriesSelected) {
          return {
            ...state,
            selectedConsumptionCountries: []
          };
        }
        return {
          ...state,
          selectedConsumptionCountries: consumptionCountries.map(elem => elem.id)
        };
      }
      case 'selectAllIndicators': {
        const allIndicatorsSelected = state.selectedIndicators.length === indicators.length;
        if (allIndicatorsSelected) {
          return {
            ...state,
            selectedIndicators: [],
            selectedIndicatorsFilters: {}
          };
        }
        return {
          ...state,
          selectedIndicators: indicators.map(elem => elem.name)
        };
      }
      case 'optionFilterClear': {
        const selectedIndicatorsFilters = { ...state.selectedIndicatorsFilters };
        delete selectedIndicatorsFilters[action.payload];
        return { ...state, selectedIndicatorsFilters };
      }
      case 'optionFilterChange': {
        const filter = action.payload;
        const selectedIndicators = union(state.selectedIndicators, [filter.name]);

        return {
          ...state,
          selectedIndicators,
          selectedIndicatorsFilters: {
            ...state.selectedIndicatorsFilters,
            [filter.name]: filter
          }
        };
      }
      case 'selectCountry': {
        return {
          ...state,
          selectedCountry: action.payload
        };
      }
      case 'selectCommodity': {
        return {
          ...state,
          selectedCommodity: action.payload
        };
      }
      case 'selectYears': {
        const newSelectedYears = xor(state.selectedYears, [action.payload]);
        return {
          ...state,
          selectedYears: newSelectedYears
        };
      }
      case 'selectExporters': {
        const newSelectedExporters = xor(state.selectedExporters, [action.payload]);
        return {
          ...state,
          selectedExporters: newSelectedExporters
        };
      }
      case 'selectConsumptionCountries': {
        const newSelectedConsumptionCountries = xor(state.selectedConsumptionCountries, [
          action.payload
        ]);
        return {
          ...state,
          selectedConsumptionCountries: newSelectedConsumptionCountries
        };
      }
      case 'selectIndicators': {
        const newSelectedIndicators = xor(state.selectedIndicators, [action.payload]);
        const newSelectedIndicatorsFilters = { ...state.selectedIndicatorsFilters };

        if (!newSelectedIndicators.includes(action.payload)) {
          delete newSelectedIndicatorsFilters[action.payload];
        }

        return {
          ...state,
          selectedIndicators: newSelectedIndicators,
          selectedIndicatorsFilters: newSelectedIndicatorsFilters
        };
      }
      case 'setOutputType': {
        return {
          ...state,
          outputType: action.payload
        };
      }
      case 'setFormatType': {
        return {
          ...state,
          fileExtension: action.payload.extension,
          fileSeparator: action.payload.separator
        };
      }
      default:
        return state;
    }
  }
  const [state, dataPortalDispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (state.formVisible) {
      onDataDownloadFormLoaded();
    }
  }, [onDataDownloadFormLoaded, state.formVisible]);
  useEffect(() => {
    if (state.selectedCommodity) {
      onContextSelected(state.selectedCommodity);
    }
  }, [onContextSelected, state.selectedCommodity]);
  useEffect(() => {
    if (selectedContext) {
      loadContextNodes(selectedContext.id);
    }
  }, [loadContextNodes, selectedContext]);

  const allYearsSelected = state.selectedYears.length === selectedContext?.years.length;
  const allExportersSelected = state.selectedExporters.length === exporters.length;
  const allConsumptionCountriesSelected =
    state.selectedConsumptionCountries.length === consumptionCountries.length;
  const allIndicatorsSelected = state.selectedIndicators.length === indicators.length;

  const indicatorFilters = useMemo(() => {
    const _indicators = allIndicatorsSelected ? [] : state.selectedIndicators;

    return _indicators.map(
      indicator => state.selectedIndicatorsFilters[indicator] || { name: indicator }
    );
  }, [allIndicatorsSelected, state.selectedIndicators, state.selectedIndicatorsFilters]);

  const downloadURLParams = useMemo(() => {
    if (state.selectedCommodity === null) {
      return [];
    }
    const contextId = selectedContext.id;
    const file = state.fileExtension;
    const params = {
      context_id: contextId
    };

    params.years = allYearsSelected ? [] : state.selectedYears;
    params.e_ids = allExportersSelected ? [] : state.selectedExporters;
    params.c_ids = allConsumptionCountriesSelected ? [] : state.selectedConsumptionCountries;
    params.filters = indicatorFilters;

    if (file === '.csv') {
      params.separator = state.fileSeparator;
    }
    params[state.outputType] = 1;

    return params;
  }, [
    allConsumptionCountriesSelected,
    allExportersSelected,
    allYearsSelected,
    indicatorFilters,
    selectedContext,
    state.fileExtension,
    state.fileSeparator,
    state.outputType,
    state.selectedCommodity,
    state.selectedConsumptionCountries,
    state.selectedExporters,
    state.selectedYears
  ]);

  const downloadFile = inputParams => {
    const params = inputParams || downloadURLParams;
    if (!params.context_id) {
      return;
    }

    const file = state.fileExtension;
    const fileUrl =
      file === '.json' ? GET_JSON_DATA_DOWNLOAD_FILE_URL : GET_CSV_DATA_DOWNLOAD_FILE_URL;
    const downloadURL = getURLFromParams(fileUrl, params);

    onDownloadTriggered(
      Object.assign(
        {
          file,
          type: state.currentDownloadType
        },
        params
      )
    );

    window.open(downloadURL);

    dataPortalDispatch({ type: 'setDownloaded', payload: true });
  };

  return (
    <div className="l-data">
      {DATA_DOWNLOAD_ENABLED === false && <DataPortalDisabledMessage />}
      <DataPortalForm
        autoCompleteCountries={autoCompleteCountries}
        isFormVisible={state.formVisible}
        closeForm={() => dataPortalDispatch({ type: 'setForm', payload: false })}
        downloadFile={downloadFile}
        downloaded={state.downloaded}
      />
      <div className="row column">
        <BulkDownloadsBlock
          contexts={enabledContexts}
          enabled={DATA_DOWNLOAD_ENABLED}
          onButtonClicked={() => dataPortalDispatch({ type: 'setDownloadType', payload: 'bulk' })}
        />
        <div className="c-custom-dataset">
          <div className="c-custom-dataset__title">CREATE A CUSTOM DATASET</div>
          <div className="row">
            <div className="small-9 columns">
              <CustomDownload
                dataPortalDispatch={dataPortalDispatch}
                selectedExporters={state.selectedExporters}
                selectedYears={state.selectedYears}
                selectedCountry={state.selectedCountry}
                selectedCommodity={state.selectedCommodity}
                allYearsSelected={allYearsSelected}
                allExportersSelected={allExportersSelected}
                allConsumptionCountriesSelected={allConsumptionCountriesSelected}
                allIndicatorsSelected={allIndicatorsSelected}
                selectedConsumptionCountries={state.selectedConsumptionCountries}
                selectedIndicatorsFilters={state.selectedIndicatorsFilters}
                selectedIndicators={state.selectedIndicators}
              />
            </div>
            <div className="small-3 columns">
              <FormatSidebar
                dataPortalDispatch={dataPortalDispatch}
                fileExtension={state.fileExtension}
                fileSeparator={state.fileSeparator}
                outputType={state.outputType}
                selectedCountry={selectedContext?.countryId}
                selectedCommodity={selectedContext?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DataPortal.propTypes = {
  autoCompleteCountries: PropTypes.string,
  enabledContexts: PropTypes.array.isRequired,
  consumptionCountries: PropTypes.array,
  exporters: PropTypes.array,
  indicators: PropTypes.array,
  onContextSelected: PropTypes.func,
  onDataDownloadFormLoaded: PropTypes.func,
  onDownloadTriggered: PropTypes.func,
  selectedContext: PropTypes.object
};

export default DataPortal;
