import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import LoadConsumer from '../LoadConsumer';
import LoadProvider from '../LoadProvider';
import { LoadContext } from '../types/Load';

class ChildComponent extends React.Component<any, any> {
  public render() {
    return null;
  }
}

describe('test LoadContext', () => {
  describe('test LoadContext props', () => {
    it('should have setLoading', () => {
      const testRenderer = TestRenderer.create(
        <LoadProvider>
          <LoadConsumer>{(loadProps: LoadContext) => <ChildComponent load={loadProps} />}</LoadConsumer>
        </LoadProvider>
      );
      const testInstance = testRenderer.root;
      const childInstance = testInstance.findByType(ChildComponent);
      expect(childInstance.props.load.setLoading).toBeTruthy();
    });

    it('should have setError', () => {
      const testRenderer = TestRenderer.create(
        <LoadProvider>
          <LoadConsumer>{(loadProps: LoadContext) => <ChildComponent load={loadProps} />}</LoadConsumer>
        </LoadProvider>
      );
      const testInstance = testRenderer.root;
      const childInstance = testInstance.findByType(ChildComponent);
      expect(childInstance.props.load.setError).toBeTruthy();
    });

    it('should have setResult', () => {
      const testRenderer = TestRenderer.create(
        <LoadProvider>
          <LoadConsumer>{(loadProps: LoadContext) => <ChildComponent load={loadProps} />}</LoadConsumer>
        </LoadProvider>
      );
      const testInstance = testRenderer.root;
      const childInstance = testInstance.findByType(ChildComponent);
      expect(childInstance.props.load.setResult).toBeTruthy();
    });
  });

  describe('test LoadProvider state', () => {
    it('setLoading should reset error and result and set isLoading to true', () => {
      const testRenderer = TestRenderer.create(
        <LoadProvider>
          <LoadConsumer>{(loadProps: LoadContext) => <ChildComponent load={loadProps} />}</LoadConsumer>
        </LoadProvider>
      );
      const testInstance = testRenderer.root;
      const childInstance = testInstance.findByType(ChildComponent);
      childInstance.props.load.setLoading(true);
      expect(childInstance.props.load.isLoading).toEqual(true);
      expect(childInstance.props.load.isError).toEqual(false);
      expect(childInstance.props.load.error).toEqual(null);
      expect(childInstance.props.load.result).toEqual(null);
    });

    it('setResult should reset error and loading', async () => {
      const testRenderer = TestRenderer.create(
        <LoadProvider>
          <LoadConsumer>{(loadProps: LoadContext) => <ChildComponent load={loadProps} />}</LoadConsumer>
        </LoadProvider>
      );
      const testInstance = testRenderer.root;
      const childInstance = testInstance.findByType(ChildComponent);
      await childInstance.props.load.setResult({
        message: 'Hello world',
      });
      expect(childInstance.props.load.isLoading).toEqual(false);
      expect(childInstance.props.load.isError).toEqual(false);
      expect(childInstance.props.load.error).toEqual(null);
      expect(childInstance.props.load.result).toEqual({
        message: 'Hello world',
      });
    });

    it('setError should reset result and loading', async () => {
      const testRenderer = TestRenderer.create(
        <LoadProvider>
          <LoadConsumer>{(loadProps: LoadContext) => <ChildComponent load={loadProps} />}</LoadConsumer>
        </LoadProvider>
      );
      const testInstance = testRenderer.root;
      const childInstance = testInstance.findByType(ChildComponent);
      await childInstance.props.load.setError('error message');
      expect(childInstance.props.load.isLoading).toEqual(false);
      expect(childInstance.props.load.isError).toEqual(true);
      expect(childInstance.props.load.error).toEqual('error message');
      expect(childInstance.props.load.result).toEqual(null);
    });
  });
});
