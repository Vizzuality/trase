import React from 'react';

export function mapToVanilla(VanillaComponent, methodProps, callbackProps) {
  mapToVanilla.displayName = `VanillaReactBridgeHOC(${VanillaComponent.displayName ||
    VanillaComponent.name ||
    'Component'})`;

  class VanillaReactBridge extends React.PureComponent {
    instance = null;

    componentDidMount() {
      this.instance = new VanillaComponent(this.props);

      if (callbackProps && callbackProps.length > 0) {
        this.instance.callbacks = {};
        callbackProps.forEach(callback => {
          this.instance.callbacks[callback] = this.props[callback];
        });
      }

      if (this.instance.onCreated) {
        this.instance.onCreated(this.props);
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
        const hasChanged = method.compared.reduce(
          (acc, next) => acc || this.props[next] !== prevProps[next],
          false
        );
        if (hasChanged) {
          const fn = this.instance[method.name];
          const props = method.returned.reduce(
            (acc, next) => ({
              ...acc,
              [next]: this.props[next]
            }),
            {}
          );
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
