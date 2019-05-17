import React from 'react';
import PropTypes from 'prop-types';
import InView from 'react-components/shared/in-view.component';

function ImgBackground(props) {
  // the idea is to provide a srcSet + sizes and grab one or another depending on the screen res
  // and expose an ImgContextProvider that the users can use to pass their media-queries
  const { as, alt: title, src, children, ...rest } = props;

  return (
    <InView triggerOnce>
      {({ ref, inView }) => {
        const styleWithBackground = { backgroundImage: `url(${src})`, ...rest.style };
        const style = inView && src ? styleWithBackground : rest.style;
        const currentProps = {
          ref,
          style,
          title,
          ...rest
        };

        return (
          <>
            {React.createElement(as, currentProps, children)}
            {!inView && (
              <a
                style={{ display: 'block', visibility: 'hidden', position: 'absolute' }}
                href={src}
                aria-hidden="true"
              >
                {title}
              </a>
            )}
          </>
        );
      }}
    </InView>
  );
}

ImgBackground.defaultProps = {
  as: 'div'
};

ImgBackground.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.array,
  children: PropTypes.any,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default ImgBackground;
