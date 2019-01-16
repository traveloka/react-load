import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import load from '../load';

describe('test load hoc', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  describe('test loading function', () => {
    it('isLoading props should be true', () => {
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
      jest.runAllTimers();
      expect(testInstance.props.load.isLoading).toEqual(false);
      expect(testInstance.props.load.isError).toEqual(false);
      expect(testInstance.props.load.result).toEqual('hello');
    });
  });
  it('parameters should be corrent', () => {
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
    jest.runAllTimers();
    expect(testInstance.state.value).toEqual('new value');
  });

  describe('test error function', () => {
    it('isLoading props should be true', () => {
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
      jest.runAllTimers();
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(testInstance.props.load.isLoading).toEqual(false);
      expect(testInstance.props.load.isError).toEqual(true);
      expect(testInstance.props.load.error).toEqual('error');
      expect(testInstance.props.load.result).toEqual(null);
      jest.useFakeTimers();
      testInstance.props.load.retry();
      expect(testInstance.props.load.isLoading).toEqual(true);
      expect(testInstance.props.load.isError).toEqual(false);
      expect(testInstance.props.load.result).toEqual(null);
      jest.runAllTimers();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
