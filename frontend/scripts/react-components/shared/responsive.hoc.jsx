import React, { Component } from 'react';
import debounce from 'lodash/debounce';

const DEFAULT_DEBOUNCE_RATE = 200;

export default function({ debounceRate = DEFAULT_DEBOUNCE_RATE } = {}) {
  return function ResponsiveEnhancer(WrappedComponent) {
    return class extends Component {
      constructor(props) {
        super(props);

        this.state = {
          width: null,
          height: null
        };

        this.onPageResize = debounce(this.onPageResize.bind(this), debounceRate);
      }

      componentDidMount() {
        window.addEventListener('resize', this.onPageResize, { passive: true });
        this.setSize();
      }

      componentWillUnmount() {
        window.removeEventListener('resize', this.onPageResize, { passive: true });
      }

      onPageResize() {
        this.setSize();
      }

      setSize() {
        const { width, height } = this.responsiveContainer.getBoundingClientRect();

        if (this.state.width !== width || this.state.height !== height) {
          this.setState({
            width,
            height
          });
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
            <WrappedComponent {...this.props} width={this.state.width} height={this.state.height} />
          </div>
        );
      }
    };
  };
}
