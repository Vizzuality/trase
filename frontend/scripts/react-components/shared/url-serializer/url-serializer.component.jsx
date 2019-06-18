import { useEffect } from 'react';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import isEmpty from 'lodash/isEmpty';

const defaultStringify = (value, DONT_SERIALIZE) => {
  if ((typeof value !== 'boolean' && isEmpty(value)) || !value) {
    return DONT_SERIALIZE;
  }
  return value;
};

function UrlSerializer(props) {
  const { query, urlProps, urlPropHandlers, serializer, DONT_SERIALIZE } = props;

  useEffect(() => {
    let removedProps;
    const stringifiedProps = mapValues(urlProps, (value, key) =>
      urlPropHandlers[key]
        ? urlPropHandlers[key].stringify(value, DONT_SERIALIZE)
        : defaultStringify(value, DONT_SERIALIZE)
    );
    const finalUrlProps = pickBy(stringifiedProps, prop => prop !== DONT_SERIALIZE);
    const finalKeys = new Set(Object.keys(finalUrlProps));
    const originalKeys = Object.keys(urlProps);
    if (finalKeys.size < originalKeys.length) {
      // in this case a urlProp has been removed, we need to make sure to remove it from the url
      removedProps = originalKeys.filter(key => !finalKeys.has(key));
    }
    serializer(query, finalUrlProps, removedProps);
  }, [DONT_SERIALIZE, query, serializer, urlPropHandlers, urlProps]);

  return null;
}

UrlSerializer.defaultProps = {
  urlPropHandlers: {}
};

export default UrlSerializer;
