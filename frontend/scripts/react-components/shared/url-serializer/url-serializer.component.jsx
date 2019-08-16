import { useEffect } from 'react';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import isEmpty from 'lodash/isEmpty';

export const DONT_SERIALIZE = 'NO_CEREAL_RYAN_GOSLING';

export const deserialize = ({ props, params, state = {}, urlPropHandlers = {} }) =>
  props.reduce((acc, prop) => {
    const getParsedValue = urlPropHandlers[prop] ? urlPropHandlers[prop].parse : x => x;
    return {
      ...acc,
      [prop]: typeof params[prop] !== 'undefined' ? getParsedValue(params[prop]) : state[prop]
    };
  }, state);

const defaultStringify = value => {
  if ((typeof value === 'object' && isEmpty(value)) || (!value && value !== 0)) {
    return DONT_SERIALIZE;
  }
  return value;
};

function UrlSerializer(props) {
  const { query, urlProps, urlPropHandlers, serializer } = props;

  useEffect(() => {
    let removedProps;
    const stringifiedProps = mapValues(urlProps, (value, key) =>
      urlPropHandlers[key] && urlPropHandlers[key].stringify
        ? urlPropHandlers[key].stringify(value, DONT_SERIALIZE)
        : defaultStringify(value)
    );
    const finalUrlProps = pickBy(stringifiedProps, prop => prop !== DONT_SERIALIZE);
    const finalKeys = new Set(Object.keys(finalUrlProps));
    const originalKeys = Object.keys(urlProps);
    if (finalKeys.size < originalKeys.length) {
      // in this case a urlProp has been removed, we need to make sure to remove it from the url
      removedProps = originalKeys.filter(key => !finalKeys.has(key));
    }
    serializer(query, finalUrlProps, removedProps);
  }, [query, serializer, urlPropHandlers, urlProps]);

  return null;
}

UrlSerializer.defaultProps = {
  query: {},
  urlPropHandlers: {}
};

export default UrlSerializer;
