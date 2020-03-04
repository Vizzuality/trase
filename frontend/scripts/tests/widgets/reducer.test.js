import reducer, { defaultEndpoint } from 'react-components/widgets/widgets.reducer';
import initialState from 'react-components/widgets/widgets.initial-state';
import {
  WIDGETS__INIT_ENDPOINT,
  WIDGETS__SET_ENDPOINT_DATA,
  WIDGETS__SET_ENDPOINT_ERROR
} from 'react-components/widgets/widgets.actions';

const someEndpoint = 'someEndpoint';
const someKey = 'some_key_value_pair';
const someMeta = { name: 'someMeta' };
const someError = { name: 'someError' };
const someState = {
  ...initialState,
  endpoints: {
    ...initialState.endpoints,
    [someEndpoint]: defaultEndpoint(someKey)
  }
};

test(WIDGETS__INIT_ENDPOINT, () => {
  const action = {
    type: WIDGETS__INIT_ENDPOINT,
    payload: {
      endpoint: someEndpoint,
      key: someKey
    }
  };
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    endpoints: {
      someEndpoint: {
        data: null,
        loading: true,
        error: null,
        key: someKey
      }
    }
  });
});

describe(WIDGETS__SET_ENDPOINT_DATA, () => {
  it('sets endpoint array data', () => {
    const someData = [{ id: 0 }, { id: 1 }];
    const action = {
      type: WIDGETS__SET_ENDPOINT_DATA,
      payload: {
        data: someData,
        endpoint: someEndpoint,
        meta: someMeta
      }
    };

    const newState = reducer(someState, action);
    expect(newState.endpoints.someEndpoint).toEqual({
      ...someState.endpoints.someEndpoint,
      data: someData,
      meta: someMeta,
      loading: false
    });
  });

  it('sets endpoint object data', () => {
    const someData = {
      property_one: 1,
      property_two: 2
    };
    const action = {
      type: WIDGETS__SET_ENDPOINT_DATA,
      payload: {
        data: someData,
        endpoint: someEndpoint,
        meta: someMeta
      }
    };
    const newState = reducer(someState, action);
    expect(newState.endpoints.someEndpoint).toEqual({
      ...someState.endpoints.someEndpoint,
      data: { propertyOne: 1, propertyTwo: 2 },
      meta: someMeta,
      loading: false
    });
  });
});

test(WIDGETS__SET_ENDPOINT_ERROR, () => {
  const action = {
    type: WIDGETS__SET_ENDPOINT_ERROR,
    payload: {
      endpoint: someEndpoint,
      error: someError
    }
  };

  const newState = reducer(someState, action);
  expect(newState.endpoints.someEndpoint).toEqual({
    ...someState.endpoints.someEndpoint,
    error: someError,
    loading: false
  });
});
