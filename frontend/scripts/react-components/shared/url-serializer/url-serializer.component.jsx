import { useEffect } from 'react';
import pickBy from 'lodash/pickBy';
import { DONT_SERIALIZE } from 'constants';

function UrlSerializer(props) {
  const { query, urlProps, serializer } = props;
  // don't add query as dependency cause
  // we don't care of external query params,
  // that's responsibility of the externals
  // eslint-disable react-hooks/exhaustive-deps
  useEffect(() => {
    const finalUrlProps = pickBy(urlProps, prop => prop !== DONT_SERIALIZE);
    serializer(query, finalUrlProps);
  }, [query, serializer, urlProps]);

  return null;
}

export default UrlSerializer;
