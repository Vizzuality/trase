import React from 'react';
import PropTypes from 'prop-types';
import InView from 'react-components/shared/in-view.component';

function Img(props) {
  // srcSet is just using the first item, the idea is to pass it as it to the img element
  // and expose an ImgContextProvider that the users can use to pass their sizes media-queries
  const { as, alt, src, srcSet, sizes, ...rest } = props;
  if (typeof alt === 'undefined' && NODE_ENV_DEV) {
    console.warn(
      "You're using an image without an alt text, this will harm SEO and accessibility."
    );
  }

  if (!srcSet && NODE_ENV_DEV) {
    console.warn(
      "You're not providing a srcSet for responsive img alternatives, this will harm performance."
    );
  }

  return (
    <InView triggerOnce>
      {({ ref, inView }) => {
        const srcSetProp = inView && srcSet ? srcSet.join(', ') : undefined;
        const srcProp = inView && src ? src : undefined;

        // for now we pass sizes as is, but the idea is to also fallback to ImgContextProvider version
        // so the user could either provided it per IMG or one context per all IMGs
        return (
          <>
            <img ref={ref} alt={alt} sizes={sizes} srcSet={srcSetProp} src={srcProp} {...rest} />
            {!inView && (
              <a
                href={src}
                style={{ visibility: 'hidden', position: 'absolute' }}
                aria-hidden="true"
              >
                {alt}
              </a>
            )}
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
