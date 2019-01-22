import * as React from 'react';

import { Provider, K_DEFAULT_KEY, initialState, initialContext } from './LoadContext';
import { LoadContext, LoadStateByKey, LoadState, RetryFn } from './types/Load';
import log from './utils/log';

export default class ComponentStateProvider extends React.Component<any, LoadStateByKey> {
  private mount: boolean = false;
  public state: LoadStateByKey = initialState;

  constructor(props: any) {
    super(props);
    this.mount = true;
  }

  public componentWillUnmount() {
    this.mount = false;
  }

  public render() {
    return <Provider value={this.getContext()}>{this.props.children}</Provider>;
  }

  private setLoadingByKey = (key: string, isLoading: boolean): Promise<any> => {
    if (!this.mount) return Promise.resolve();
    log('SET LOADING BY KEY', { key, isLoading });
    const loadingValue: number = isLoading ? 1 : -1;
    return new Promise(resolve => {
      this.setState((prevState: LoadStateByKey = initialState) => {
        const loadingCount: number = prevState[key] ? prevState[key]._loadingCount : 0;
        return {
          ...prevState,
          [key]: {
            ...(prevState[key] || {}),
            error: null,
            result: null,
            isError: false,
            isLoading: loadingCount + loadingValue > 0,
            _loadingCount: loadingCount + loadingValue,
          },
        };
      }, resolve);
    });
  };

  private setErrorByKey = (key: string, error: any, retryFn: RetryFn): Promise<any> => {
    if (!this.mount) return Promise.resolve();
    return this.setLoadingByKey(key, false).then(() => {
      return new Promise(resolve => {
        this.setState(
          (prevState: LoadStateByKey = initialState) => ({
            ...prevState,
            [key]: {
              ...(prevState[key] || {}),
              result: null,
              isError: !!error,
              error,
              retry: retryFn,
            },
          }),
          resolve
        );
      });
    });
  };

  private setResultByKey = (key: string, result: any): Promise<any> => {
    if (!this.mount) return Promise.resolve();
    return this.setLoadingByKey(key, false).then(() => {
      return new Promise(resolve => {
        this.setState(
          (prevState: LoadStateByKey = initialState) => ({
            ...prevState,
            [key]: {
              ...(prevState[key] || {}),
              error: null,
              isError: false,
              result,
            },
          }),
          resolve
        );
      });
    });
  };

  private getStateByKey = (key: string): LoadState => {
    return this.state[key] || initialContext;
  };

  private getLoadingByKey = (key: string): boolean => {
    return this.getStateByKey(key).isLoading;
  };

  private getErrorByKey = (key: string): any => {
    return this.getStateByKey(key).error;
  };

  private getResultByKey = (key: string): any => {
    return this.getStateByKey(key).result;
  };

  private getContext(): LoadContext {
    return {
      ...this.getStateByKey(K_DEFAULT_KEY),
      setLoading: (isLoading: boolean) => this.setLoadingByKey(K_DEFAULT_KEY, isLoading),
      setError: (error: any, retryFn: RetryFn) => this.setErrorByKey(K_DEFAULT_KEY, error, retryFn),
      setResult: (result: any) => this.setResultByKey(K_DEFAULT_KEY, result),
      setLoadingByKey: this.setLoadingByKey,
      setErrorByKey: this.setErrorByKey,
      setResultByKey: this.setResultByKey,
      getLoadingByKey: this.getLoadingByKey,
      getErrorByKey: this.getErrorByKey,
      getResultByKey: this.getResultByKey,
    };
  }
}
