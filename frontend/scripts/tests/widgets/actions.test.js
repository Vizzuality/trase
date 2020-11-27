import { getURLFromParams } from 'utils/getURLFromParams';
import { prepareWidget, getWidgetState } from 'react-components/widgets/widgets.actions';

jest.mock('utils/getURLFromParams', () => ({
  getURLFromParams: jest.fn()
}));

describe('test prepareWidget helper function', () => {
  const someEndpoint = 'someEndpoint';
  const rawEndpoint = 'https://supplychains.trase.earth/data';
  const someKey = 'id0_namesomeName';
  const someParams = { id: 0, name: 'someName' };
  const someUrl = 'http://supplychains.trase.earth';
  const someEndpoints = {
    [someEndpoint]: {
      key: someKey
    }
  };

  getURLFromParams.mockImplementation(() => someUrl);

  it('should return false if there is a cache hit', () => {
    const result = prepareWidget(someEndpoints, { endpoint: someEndpoint, params: someParams });
    expect(result).toEqual({ cacheMiss: false, key: someKey, url: someUrl });
  });

  it('should return a url if endpoint is undefined', () => {
    const result = prepareWidget({}, { endpoint: someEndpoint, params: someParams });
    expect(result).toEqual({ cacheMiss: true, key: someKey, url: someUrl });
  });

  it('should return a url if key has changed', () => {
    const result = prepareWidget(someEndpoints, {
      endpoint: someEndpoint,
      params: { ...someParams, id: 5 }
    });
    expect(result).toEqual({ cacheMiss: true, key: 'id5_namesomeName', url: someUrl });
  });

  it('should return a raw url if the raw flag is passed', () => {
    const noParams = 'noParamstrue';
    const result = prepareWidget(someEndpoints, {
      endpoint: rawEndpoint,
      raw: true
    });
    expect(result).toEqual({ cacheMiss: true, key: noParams, url: rawEndpoint });
  });

  it('should return a raw url with params', () => {
    const result = prepareWidget(someEndpoints, {
      raw: true,
      params: someParams,
      endpoint: rawEndpoint
    });
    expect(result).toEqual({
      cacheMiss: true,
      key: someKey,
      url: `${rawEndpoint}?id=0&name=someName`
    });
  });

  it('should return a raw url with added params', () => {
    const result = prepareWidget(someEndpoints, {
      raw: true,
      params: someParams,
      endpoint: `${rawEndpoint}?type=advanced`
    });
    expect(result).toEqual({
      cacheMiss: true,
      key: someKey,
      url: `${rawEndpoint}?type=advanced&id=0&name=someName`
    });
  });
});

describe('test getWidgetState helper function', () => {
  const someEndpoints = {
    someQuery: { loading: true, data: null, meta: null, key: 'someKey' },
    anotherQuery: {
      loading: false,
      data: [1, 2],
      meta: {},
      key: 'anotherKey'
    }
  };
  it('should return loading if not endpoint matches', () => {
    const result = getWidgetState(['someQuery'], {});
    expect(result).toEqual({ loading: true });
  });

  it('should return existing data + loading state', () => {
    const result = getWidgetState(['someQuery', 'anotherQuery'], someEndpoints);
    expect(result).toEqual({
      loading: true,
      data: { someQuery: null, anotherQuery: someEndpoints.anotherQuery.data },
      meta: { someQuery: null, anotherQuery: {} }
    });
  });

  it('should return existing data + error state', () => {
    const someError = { someError: true };
    const result = getWidgetState(['someQuery', 'anotherQuery', 'yetAnotherQuery'], {
      ...someEndpoints,
      someQuery: { ...someEndpoints.someQuery, loading: false },
      yetAnotherQuery: { loading: false, data: null, key: 'yetAnotherKey', error: someError }
    });
    expect(result).toEqual({
      loading: false,
      error: someError,
      data: {
        someQuery: null,
        yetAnotherQuery: null,
        anotherQuery: someEndpoints.anotherQuery.data
      },
      meta: { someQuery: null, yetAnotherQuery: null, anotherQuery: {} }
    });
  });
});
