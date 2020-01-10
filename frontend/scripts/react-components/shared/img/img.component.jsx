import React from 'react';
import PropTypes from 'prop-types';
import InView from 'react-components/shared/in-view.component';

function Img(props) {
  const { as, alt, src, srcSet, sizes, ...rest } = props;

  return (
    <InView triggerOnce>
      {({ ref, inView }) => {
        const srcSetProp = inView && srcSet ? srcSet.join(', ') : undefined;
        const srcProp = inView && src ? src : undefined;

        return (
          <>
            <img ref={ref} alt={alt} sizes={sizes} srcSet={srcSetProp} src={srcProp} {...rest} />
          </>
        );
      }}
    </InView>
  );
}

Img.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  srcSet: PropTypes.array,
  sizes: PropTypes.string,
  children: PropTypes.any,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Img;
