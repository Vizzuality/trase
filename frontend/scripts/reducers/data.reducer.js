import actions from 'actions';

export default function (state = {}, action) {
  let newState;

  switch (action.type) {

    case actions.LOAD_CONTEXTS: {
      newState = Object.assign({}, state, { contexts: action.payload });
      break;
    }

    case actions.LOAD_EXPORTERS: {
      newState = Object.assign({}, state, { exporters: action.exporters });
      break;
    }

    case actions.LOAD_CONSUMPTION_COUNTRIES: {
      newState = Object.assign({}, state, { consumptionCountries: action.consumptionCountries });
      break;
    }

    case actions.LOAD_INDICATORS: {
      newState = Object.assign({}, state, { indicators: action.indicators });
      break;
    }

    default:
      newState = state;
      break;
  }

  return newState;
}
