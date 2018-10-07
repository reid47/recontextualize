# recontextualize

A super-simple React state management library. It provides `store`/`setStore` helpers that make reading & updating your app's store as easy as updating local component state with `state`/`setState`.

Note that since this library uses the new React context API, it requires React 16.3 or higher.

## Setup & usage

Install from NPM:

```bash
yarn add recontextualize
# or 'npm install recontextualize'
```

Set things up by calling `createStore` with your initial store:

```jsx
// my-store.js

import createStore from 'recontextualize';

const initialStore = {
  // Your values here!
  some: 'values',
  count: 0
};

export const { StoreProvider, StoreConsumer, withStore } = createStore(initialStore);
```

This gives you the three pieces you'll need to add a store to your app:

- `StoreProvider`: A component that should wrap your whole app. Behind the scenes, it keeps track of your store and handles updates.
- `StoreConsumer`: A component that can be used to provide access to the store anywhere in the render tree. See below for examples.
- `withStore`: A higher-order component that can be used to inject the `store` and `setStore` props into any other component. See below for examples.

Export these so they can be used elsewhere in your app.

### Using `StoreProvider`

Somewhere near the top of your render tree, wrap your whole application in the `StoreProvider` component.

```jsx
import { StoreProvider } from './my-store';
import App from './app';

export default function() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
```

### Using `StoreConsumer`

`StoreConsumer` is a component that expects its `children` to be a function that will be called with `{store, setStore}`.

`store` contains the current store, and `setStore` is a function that can be called to update the store. These behave exactly like `state`/`setState`, but they refer to your store instead of local component state.

```jsx
import { StoreConsumer } from './my-store';

export default function MyComponent(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <StoreConsumer>
        {({ store, setStore }) => (
          <div>
            <span>the count is: {store.count}</span>
            <button onClick={() => setStore({ count: store.count + 1 })}>increment</button>
          </div>
        )}
      </StoreConsumer>
    </div>
  );
}
```

### Using `withStore`

This is the other way to access your store. Wrap a component with `withStore` to inject `store` and `setStore` as props.

Again, `store`/`setStore` behave exactly like `state`/`setState`.

```jsx
import React from 'react';
import { withStore } from './my-store-provider';

function MyComponent({ title, store, setStore }) {
  return (
    <div>
      <h1>{title}</h1>
      <div>
        <span>the count is: {store.count}</span>
        <button onClick={() => setStore({ count: store.count + 1 })}>increment</button>
      </div>
    </div>
  );
}

export default withStore(MyComponent);
```

Any components that render `MyComponent` will not need to pass in the `store` or `setStore` props; these will come in directly from the store.
