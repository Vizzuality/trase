import React from 'react';

export function mapToVanilla(VanillaComponent, methodProps) {
  mapToVanilla.displayName = `VanillaReactBridgeHOC(${VanillaComponent.displayName ||
    VanillaComponent.name ||
    'Component'})`;

  class VanillaReactBridge extends React.PureComponent {
    instance = null;

    componentDidMount() {
      // eslint-disable-next-line
      this.instance = new VanillaComponent(this.props);

      if (this.instance.onCreated) {
        this.instance.onCreated();
      }
    }

    componentWillUnmount() {
      if (this.instance.onRemoved) {
        this.instance.onRemoved();
      } else {
        console.warn('Vanilla component doesnt implement unmount logic, possible memory leak');
      }
      this.instance = null;
    }

    componentDidUpdate(prevProps) {
      methodProps.forEach(method => {
        if (this.props[method.compared] !== prevProps[method.compared]) {
          const fn = this.instance[method.name];
          const props = method.returned.reduce((acc, next) => ({
            ...acc,
            [next]: this.props[next]
          }));
          fn.call(this.instance, props);
        }
      });
    }

    render() {
      return null;
    }
  }

  return VanillaReactBridge;
}
