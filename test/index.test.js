import PropTypes from 'prop-types';
import React from 'react';
import * as ReactIs from 'react-is';
import TestRenderer from 'react-test-renderer';
import createStore from '../src';

describe('createStore with an initial store object', () => {
  let initialStore, StoreProvider, StoreConsumer, withStore;

  beforeEach(() => {
    initialStore = {
      booleanProp: false,
      numberProp: 47,
      objProp: { a: true, b: 'hello' }
    };

    ({ StoreProvider, StoreConsumer, withStore } = createStore(initialStore));
  });

  it('returns a StoreProvider component', () => {
    expect(typeof StoreProvider).toBe('function');
    expect(StoreProvider.displayName).toBe('StoreProvider');
    expect(ReactIs.isElement(<StoreProvider />)).toBeTruthy();
  });

  it('returns a StoreConsumer component', () => {
    expect(typeof StoreConsumer).toBe('object');
    expect(ReactIs.isElement(<StoreConsumer />)).toBeTruthy();
  });

  it('returns a withStore function', () => {
    expect(typeof withStore).toBe('function');
  });

  describe('withStore', () => {
    let TestApp, ComponentWithoutStore, ComponentWithStore;

    beforeEach(() => {
      ComponentWithoutStore = class extends React.PureComponent {
        static propTypes = {
          otherProp: PropTypes.string
        };

        static defaultProps = {
          otherProp: 'hello'
        };

        render() {
          const { numberProp, otherProp } = this.props;
          return (
            <h1>
              {otherProp}: {numberProp}
            </h1>
          );
        }
      };

      ComponentWithStore = withStore(ComponentWithoutStore);

      TestApp = class extends React.Component {
        render() {
          return (
            <StoreProvider>
              <ComponentWithStore />
            </StoreProvider>
          );
        }
      };
    });

    it('returns a component', () => {
      expect(ComponentWithStore).toBeDefined();
      expect(ReactIs.isElement(<ComponentWithStore />)).toBeTruthy();
    });

    it('sets propTypes on wrapped component', () => {
      expect(ComponentWithStore.propTypes).toEqual(ComponentWithoutStore.propTypes);
    });

    it('sets defaultProps on wrapped component', () => {
      expect(ComponentWithStore.defaultProps).toEqual(ComponentWithoutStore.defaultProps);
    });

    it('sets displayName on wrapped component', () => {
      expect(ComponentWithStore.displayName).toBe('withStore(ComponentWithoutStore)');
    });

    describe('rendering the wrapped component', () => {
      let rendered;

      beforeEach(() => {
        rendered = TestRenderer.create(<TestApp />);
      });

      it('passes requested props down, giving preference to explicitly passed props on collisions', () => {
        expect(rendered.root.findByType(ComponentWithStore).props).toEqual({
          otherProp: 'hello'
        });

        expect(rendered.root.findByType(ComponentWithoutStore).props).toEqual({
          otherProp: 'hello',
          store: initialStore,
          setStore: expect.any(Function)
        });
      });
    });

    describe('when displayName is set on unwrapped component', () => {
      beforeEach(() => {
        ComponentWithoutStore = class extends React.PureComponent {
          static displayName = 'TestDisplayName';

          render() {
            const { numberProp } = this.props;
            return <h1>{numberProp}</h1>;
          }
        };

        ComponentWithStore = withStore(ComponentWithoutStore);
      });

      it('uses that displayName in the displayName of the wrapped component', () => {
        expect(ComponentWithStore.displayName).toBe('withStore(TestDisplayName)');
      });
    });

    describe('using setStore', () => {
      let rendered;

      beforeEach(() => {
        ComponentWithStore = withStore(({ store, setStore }) => (
          <div>
            <div id="result">number is {store.numberProp}</div>
            <button
              id="btn1"
              onClick={() => setStore(({ numberProp }) => ({ numberProp: numberProp + 1 }))}
            >
              increment with updater function
            </button>
            <button id="btn2" onClick={() => setStore({ numberProp: 100 })}>
              set with state object
            </button>
          </div>
        ));

        TestApp = class extends React.PureComponent {
          render() {
            return (
              <StoreProvider>
                <ComponentWithStore />
              </StoreProvider>
            );
          }
        };

        rendered = TestRenderer.create(<TestApp />);
      });

      it('renders number correctly initially', () => {
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '47']);
      });

      it('works correctly when given an updater function', () => {
        rendered.root.findByProps({ id: 'btn1' }).props.onClick();
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '48']);
      });

      it('works correctly when given a state object', () => {
        rendered.root.findByProps({ id: 'btn2' }).props.onClick();
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '100']);
      });
    });
  });
});

describe('createStore with undefined initial store', () => {
  let StoreProvider, StoreConsumer, withStore;

  beforeEach(() => {
    ({ StoreProvider, StoreConsumer, withStore } = createStore());
  });

  it('returns a StoreProvider component', () => {
    expect(typeof StoreProvider).toBe('function');
    expect(StoreProvider.displayName).toBe('StoreProvider');
    expect(ReactIs.isElement(<StoreProvider />)).toBeTruthy();
  });

  it('returns a StoreConsumer component', () => {
    expect(typeof StoreConsumer).toBe('object');
    expect(ReactIs.isElement(<StoreConsumer />)).toBeTruthy();
  });

  it('returns a withStore function', () => {
    expect(typeof withStore).toBe('function');
  });
});

describe('createStore with an initial store function', () => {
  let initialStore, StoreProvider, StoreConsumer, withStore;

  beforeEach(() => {
    initialStore = () => ({
      booleanProp: false,
      numberProp: 47,
      objProp: { a: true, b: 'hello' }
    });

    ({ StoreProvider, StoreConsumer, withStore } = createStore(initialStore));
  });

  it('returns a StoreProvider component', () => {
    expect(typeof StoreProvider).toBe('function');
    expect(StoreProvider.displayName).toBe('StoreProvider');
    expect(ReactIs.isElement(<StoreProvider />)).toBeTruthy();
  });

  it('returns a StoreConsumer component', () => {
    expect(typeof StoreConsumer).toBe('object');
    expect(ReactIs.isElement(<StoreConsumer />)).toBeTruthy();
  });

  it('returns a withStore function', () => {
    expect(typeof withStore).toBe('function');
  });

  describe('withStore', () => {
    let TestApp, ComponentWithoutStore, ComponentWithStore;

    beforeEach(() => {
      ComponentWithoutStore = class extends React.PureComponent {
        static propTypes = {
          otherProp: PropTypes.string
        };

        static defaultProps = {
          otherProp: 'hello'
        };

        render() {
          const { numberProp, otherProp } = this.props;
          return (
            <h1>
              {otherProp}: {numberProp}
            </h1>
          );
        }
      };

      ComponentWithStore = withStore(ComponentWithoutStore);

      TestApp = class extends React.Component {
        render() {
          return (
            <StoreProvider>
              <ComponentWithStore />
            </StoreProvider>
          );
        }
      };
    });

    it('returns a component', () => {
      expect(ComponentWithStore).toBeDefined();
      expect(ReactIs.isElement(<ComponentWithStore />)).toBeTruthy();
    });

    it('sets propTypes on wrapped component', () => {
      expect(ComponentWithStore.propTypes).toEqual(ComponentWithoutStore.propTypes);
    });

    it('sets defaultProps on wrapped component', () => {
      expect(ComponentWithStore.defaultProps).toEqual(ComponentWithoutStore.defaultProps);
    });

    it('sets displayName on wrapped component', () => {
      expect(ComponentWithStore.displayName).toBe('withStore(ComponentWithoutStore)');
    });

    describe('rendering the wrapped component', () => {
      let rendered;

      beforeEach(() => {
        rendered = TestRenderer.create(<TestApp />);
      });

      it('passes requested props down, giving preference to explicitly passed props on collisions', () => {
        expect(rendered.root.findByType(ComponentWithStore).props).toEqual({
          otherProp: 'hello'
        });

        expect(rendered.root.findByType(ComponentWithoutStore).props).toEqual({
          otherProp: 'hello',
          store: initialStore(),
          setStore: expect.any(Function)
        });
      });
    });

    describe('when displayName is set on unwrapped component', () => {
      beforeEach(() => {
        ComponentWithoutStore = class extends React.PureComponent {
          static displayName = 'TestDisplayName';

          render() {
            const { numberProp } = this.props;
            return <h1>{numberProp}</h1>;
          }
        };

        ComponentWithStore = withStore(ComponentWithoutStore);
      });

      it('uses that displayName in the displayName of the wrapped component', () => {
        expect(ComponentWithStore.displayName).toBe('withStore(TestDisplayName)');
      });
    });

    describe('using setStore', () => {
      let rendered, callback;

      beforeEach(() => {
        callback = jest.fn();
        ComponentWithStore = withStore(({ store, setStore }) => (
          <div>
            <div id="result">number is {store.numberProp}</div>
            <button
              id="btn1"
              onClick={() => setStore(({ numberProp }) => ({ numberProp: numberProp + 1 }))}
            >
              increment with updater function
            </button>
            <button id="btn2" onClick={() => setStore({ numberProp: 100 })}>
              set with state object
            </button>
            <button id="btn3" onClick={() => setStore({ numberProp: 2 }, callback)}>
              set with state object and callback
            </button>
          </div>
        ));

        TestApp = class extends React.PureComponent {
          render() {
            return (
              <StoreProvider>
                <ComponentWithStore />
              </StoreProvider>
            );
          }
        };

        rendered = TestRenderer.create(<TestApp />);
      });

      it('renders number correctly initially', () => {
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '47']);
      });

      it('works correctly when given an updater function', () => {
        rendered.root.findByProps({ id: 'btn1' }).props.onClick();
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '48']);
      });

      it('works correctly when given a state object', () => {
        rendered.root.findByProps({ id: 'btn2' }).props.onClick();
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '100']);
      });

      it('works correctly when given a state object and callback', () => {
        rendered.root.findByProps({ id: 'btn3' }).props.onClick();
        expect(rendered.root.findByProps({ id: 'result' }).children).toEqual(['number is ', '2']);
        expect(callback).toHaveBeenCalledWith({ numberProp: 2 });
      });
    });
  });
});
