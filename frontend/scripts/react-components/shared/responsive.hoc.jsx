import React, { Component } from 'react';
import debounce from 'lodash/debounce';

const DEBOUNCE_WAIT = 200;

export function Responsive(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        width: null
      };

      this.setWidth = this.setWidth.bind(this);
    }

    componentDidMount() {
      window.addEventListener('resize', debounce(this.setWidth, DEBOUNCE_WAIT));
      this.setWidth();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.setWidth);
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
          ref={elem => {
            this.responsiveContainer = elem;
          }}
        >
          <WrappedComponent {...this.props} width={this.state.width} />
        </div>
      );
    }
  };
}
