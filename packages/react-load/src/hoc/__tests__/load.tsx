import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import load from '../load';

function flushPromises() {
  return new Promise(resolve => {
    jest.runAllTimers();
    setImmediate(resolve);
  });
}
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

describe('test load hoc', () => {
  describe('test loading function', () => {
    it('isLoading props should be true', async () => {
      class InnerTest extends React.Component {
        @load()
        public componentDidMount() {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve('hello');
            }, 1000);
          });
        }
        public render() {
          return null;
        }
      }

      const Test = load()(InnerTest);
      const rootInstance = TestRenderer.create(<Test />).root;
      const testInstance = rootInstance.findByType(InnerTest);
      expect(testInstance.props.load.isLoading).toEqual(true);
      expect(testInstance.props.load.isError).toEqual(false);
      expect(testInstance.props.load.result).toEqual(null);
      await flushPromises();
      expect(testInstance.props.load.isLoading).toEqual(false);
      expect(testInstance.props.load.isError).toEqual(false);
      expect(testInstance.props.load.result).toEqual('hello');
    });
  });

  it('parameters should be correct', async () => {
    class InnerTest extends React.Component {
      public state: any = {
        value: null,
      };
      @load()
      public handleOnChangeText(newText: string) {
        return new Promise(resolve => {
          setTimeout(() => {
            this.setState({
              value: newText,
            });
            resolve('hello');
          }, 1000);
        });
      }
      public render() {
        return null;
      }
    }

    const Test = load()(InnerTest);
    let testRef: any = null;
    const rootInstance = TestRenderer.create(<Test ref={(el: any) => (testRef = el)} />).root;
    const testInstance = rootInstance.findByType(InnerTest).instance;
    if (testRef) {
      testInstance.handleOnChangeText('new value');
    }
    await flushPromises();
    expect(testInstance.state.value).toEqual('new value');
  });

  describe('test error function', () => {
    it('isLoading props should be true', async () => {
      const mockFn = jest.fn();
      class InnerTest extends React.Component {
        @load()
        public componentDidMount() {
          return new Promise((_, reject) => {
            setTimeout(() => {
              mockFn();
              reject('error');
            }, 1000);
          });
        }
        public render() {
          return null;
        }
      }

      const Test = load()(InnerTest);
      const rootInstance = TestRenderer.create(<Test />).root;
      const testInstance = rootInstance.findByType(InnerTest);
      expect(testInstance.props.load.isLoading).toEqual(true);
      expect(testInstance.props.load.isError).toEqual(false);
      expect(testInstance.props.load.result).toEqual(null);
      expect(mockFn).not.toHaveBeenCalled();
      await flushPromises();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(testInstance.props.load.isLoading).toEqual(false);
      expect(testInstance.props.load.isError).toEqual(true);
      expect(testInstance.props.load.error).toEqual('error');
      expect(testInstance.props.load.result).toEqual(null);
      await flushPromises();
      testInstance.props.load.retry();
      expect(testInstance.props.load.isLoading).toEqual(true);
      expect(testInstance.props.load.isError).toEqual(false);
      expect(testInstance.props.load.result).toEqual(null);
      await flushPromises();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('isLoading props should be false', async () => {
      class InnerTest extends React.Component {
        @load()
        public componentDidMount() {
          throw Error('test');
        }
        public render() {
          return null;
        }
      }

      const Test = load()(InnerTest);
      const rootInstance = TestRenderer.create(<Test />).root;
      const testInstance = rootInstance.findByType(InnerTest);
      await flushPromises();
      expect(testInstance.props.load.isLoading).toEqual(false);
      expect(testInstance.props.load.isError).toEqual(true);
    });
  });
});
