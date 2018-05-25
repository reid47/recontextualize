import PropTypes from 'prop-types';
import React from 'react';
import * as ReactIs from 'react-is';
import TestRenderer from 'react-test-renderer';
import init from '../src';

describe('init', () => {
  let initialStore, StoreProvider, withStore;

  beforeEach(() => {
    initialStore = {
      booleanProp: false,
      numberProp: 47,
      objProp: { a: true, b: 'hello' }
    };

    ({ StoreProvider, withStore } = init(initialStore));
  });

  it('returns a StoreProvider component', () => {
    expect(typeof StoreProvider).toBe('object');
    expect(StoreProvider.$$typeof).not.toBeUndefined();
    expect(StoreProvider._context).not.toBeUndefined();
    expect(StoreProvider.displayName).toBe('StoreProvider');
    expect(StoreProvider._context.displayName).toBe('StoreConsumer');
  });

  it('returns a withStore function', () => {
    expect(typeof withStore).toBe('function');
  });

  describe('withStore', () => {
    let TestApp, Middle, UnwrappedComponent, WrappedComponent;

    beforeEach(() => {
      TestApp = class extends React.Component {
        state = initialStore;

        render() {
          return (
            <StoreProvider value={this.state}>
              <Middle />
            </StoreProvider>
          );
        }
      };

      Middle = class extends React.Component {
        render() {
          return <WrappedComponent otherProp="test" booleanProp={true} />;
        }
      };

      UnwrappedComponent = class extends React.PureComponent {
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

      WrappedComponent = withStore('numberProp', 'booleanProp')(UnwrappedComponent);
    });

    it('returns a component', () => {
      expect(WrappedComponent).toBeDefined();
      expect(ReactIs.isElement(<WrappedComponent />)).toBeTruthy();
    });

    it('sets propTypes on wrapped component', () => {
      expect(WrappedComponent.propTypes).toEqual(UnwrappedComponent.propTypes);
    });

    it('sets defaultProps on wrapped component', () => {
      expect(WrappedComponent.defaultProps).toEqual(UnwrappedComponent.defaultProps);
    });

    it('sets displayName on wrapped component', () => {
      expect(WrappedComponent.displayName).toBe('withStore(UnwrappedComponent)');
    });

    describe('rendering the wrapped component', () => {
      let rendered;

      beforeEach(() => {
        rendered = TestRenderer.create(<TestApp />);
      });

      it('passes requested props down, giving preference to explicitly passed props on collisions', () => {
        expect(rendered.root.findByType(UnwrappedComponent).props).toEqual({
          booleanProp: true,
          numberProp: 47,
          otherProp: 'test'
        });
      });
    });

    describe('when displayName is set on unwrapped component', () => {
      beforeEach(() => {
        UnwrappedComponent = class extends React.PureComponent {
          static displayName = 'TestDisplayName';

          render() {
            const { numberProp } = this.props;
            return <h1>{numberProp}</h1>;
          }
        };

        WrappedComponent = withStore('numberProp')(UnwrappedComponent);
      });

      it('uses that displayName in the displayName of the wrapped component', () => {
        expect(WrappedComponent.displayName).toBe('withStore(TestDisplayName)');
      });
    });
  });
});
