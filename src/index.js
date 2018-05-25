import { PureComponent, createContext } from 'react';

export default function init(initialStore) {
  const { Provider: StoreProvider, Consumer: StoreConsumer } = createContext(
    initialStore
  );

  const withStore = (requestedStoreKeys = []) => WrappedComponent => {
    return class extends PureComponent {
      render() {}
    };
  };

  return { withStore, StoreProvider };
}
