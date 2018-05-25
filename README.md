# recontextualize

A simple state management helper that makes it easy for components deep within the render tree to access data from a top-level data store (without explicitly passing the data all the way down).

Note that since it uses the new React context API, it requires React 16.3 or higher.

## usage

First, set things up by calling `initializeStore` with your store:

```jsx
import myDataStore from './my-store';
import initializeStore from 'recontextualize';

const { StoreProvider, withStore } = initializeStore(myDataStore);

export { StoreProvider, withStore };
```

This gives you the two pieces you'll need: `StoreProvider` and `withStore`.

Somewhere near the top of your render tree, wrap your whole application in the `StoreProvider` component:

```jsx
import { StoreProvider } from './my-store-provider';
import App from './app';
import myDataStore from './my-store';

export default function() {
  return (
    <StoreProvider value={myDataStore}>
      <App />
    </StoreProvider>
  );
}
```

In any component that needs to access data from your store, use `withStore` to request data from the store as props:

```jsx
import React from 'react';
import { withStore } from './my-store-provider';

class MyComponent extends React.PureComponent {
  render() {
    const { people, places, someOtherProp } = this.props;
    return <div>{/* something using those props */}</div>;
  }
}

export default withStore('people', 'places')(MyComponent);
```

Any components that render `MyComponent` will not need to pass in the `people` or `places` props; these will come in directly from the store.
