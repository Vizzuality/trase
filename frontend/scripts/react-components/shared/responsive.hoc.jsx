import React, { Component } from 'react';
import debounce from 'lodash/debounce';

const DEFAULT_DEBOUNCE_RATE = 200;

export function Responsive({ debounceRate = DEFAULT_DEBOUNCE_RATE } = {}) {
  return function ResponsiveEnhancer(WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.state = {
          width: null
        };

        this.onPageResize = debounce(this.onPageResize.bind(this), debounceRate);
      }

      componentDidMount() {
        window.addEventListener('resize', this.onPageResize);
        this.setWidth();
      }

      componentWillUnmount() {
        window.removeEventListener('resize', this.onPageResize);
      }

      onPageResize() {
        this.setWidth();
      }

      setWidth() {
        const { width } = this.state;
        const currentWidth = this.responsiveContainer.getBoundingClientRect().width;

        if (width !== currentWidth) {
          this.setState({ width: currentWidth });
        }
      }

      render() {
        return (
          <div
            className="responsive-container"
            ref={elem => {
              this.responsiveContainer = elem;
            }}
          >
            <WrappedComponent {...this.props} width={this.state.width} />
          </div>
        );
      }
    };
  };
}
