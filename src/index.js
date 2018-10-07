import React, { PureComponent, createContext } from 'react';

export default function createStore(initialStore) {
  const initial = (typeof initialStore === 'function' ? initialStore() : initialStore) || {};

  const { Provider, Consumer } = createContext(initial);

  class StoreProvider extends PureComponent {
    static displayName = 'StoreProvider';

    constructor(props) {
      super(props);

      this.setStore = (updater, callback) =>
        this.setState(
          typeof updater === 'function'
            ? ({ store }) => ({ store: { ...store, ...updater(store) } })
            : { store: { ...this.state.store, ...updater } },
          callback && (() => callback(this.state.store))
        );

      this.state = {
        store: initial,
        setStore: this.setStore
      };
    }

    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }
  }

  const withStore = C => {
    return class extends PureComponent {
      static displayName = `withStore(${C.displayName || C.name || 'Component'})`;
      static propTypes = C.propTypes;
      static defaultProps = C.defaultProps;

      render() {
        return <Consumer>{storeData => <C {...storeData} {...this.props} />}</Consumer>;
      }
    };
  };

  return { StoreProvider, StoreConsumer: Consumer, withStore };
}
