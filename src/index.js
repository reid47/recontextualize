import React, { PureComponent, createContext } from 'react';

export default function init(initialStore = {}) {
  const { Provider, Consumer } = createContext(initialStore);
  Provider.displayName = 'StoreProvider';
  Consumer.displayName = 'StoreConsumer';

  const withStore = (...requestedStoreKeys) => InnerComponent => {
    return class extends PureComponent {
      static propTypes = InnerComponent.propTypes;
      static defaultProps = InnerComponent.defaultProps;
      static displayName = `withStore(${InnerComponent.displayName ||
        InnerComponent.name ||
        'Component'})`;

      render() {
        return (
          <Consumer>
            {store => {
              const passedProps = requestedStoreKeys.reduce((memo, key) => {
                return { ...memo, [key]: store[key] };
              }, {});

              return <InnerComponent {...passedProps} {...this.props} />;
            }}
          </Consumer>
        );
      }
    };
  };

  return { withStore, StoreProvider: Provider };
}
