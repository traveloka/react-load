export type RetryFn = (...args: any[]) => any;

export type LoadState = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  result: any;
  retry: RetryFn | null;

  _loadingCount: number;
};

export type LoadStateByKey = {
  [name: string]: LoadState;
};

export type LoadContext = LoadState & {
  setResult?: (result: any) => any;
  setError?: (error: any, retryFn: RetryFn) => any;
  setLoading?: (isLoading: boolean) => any;

  getResult?: () => any;
  getError?: () => any;
  getLoading?: () => boolean;

  setResultByKey?: (key: string, result: any) => any;
  setErrorByKey?: (key: string, error: any, retryFn: RetryFn) => any;
  setLoadingByKey?: (key: string, loading: boolean) => any;
  getResultByKey?: (key: string) => any;
  getErrorByKey?: (key: string) => any;
  getLoadingByKey?: (key: string) => any;
};
