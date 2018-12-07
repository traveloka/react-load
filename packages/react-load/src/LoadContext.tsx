import * as createReactContext from 'create-react-context';
import { LoadContext, LoadStateByKey, LoadState } from './types/Load';

export const K_DEFAULT_KEY = 'tr4v3l0k4_4_4v3r';
export const initialContext: LoadState = {
  isLoading: false,
  isError: false,
  error: null,
  result: null,
  retry: () => {}, // tslint:disable-line
  _loadingCount: 0,
};
export const initialState: LoadStateByKey = {
  [K_DEFAULT_KEY]: initialContext,
};

export const { Provider, Consumer } = createReactContext<LoadContext>(initialContext);
