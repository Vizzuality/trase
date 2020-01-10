import React from 'react';
import PropTypes from 'prop-types';
import InView from 'react-components/shared/in-view.component';

function ImgBackground(props) {
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

        return <>{React.createElement(as, currentProps, children)}</>;
      }}
    </InView>
  );
}

ImgBackground.defaultProps = {
  as: 'div'
};

ImgBackground.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  children: PropTypes.any,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default ImgBackground;
