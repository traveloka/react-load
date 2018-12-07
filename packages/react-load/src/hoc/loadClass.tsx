import * as React from 'react';
import hoistNonReactStatics = require('hoist-non-react-statics');
import LoadConsumer from '../LoadConsumer';
import LoadProvider from '../LoadProvider';
import { LoadContext } from '../types/Load';

export default function withLoad(WrapperComponent: React.ComponentType<any>) {
  let Comp: React.ComponentType<any> = class extends React.Component<any, any> {
    public render() {
      return (
        <LoadProvider>
          <LoadConsumer>
            {(loadProps: LoadContext) => <WrapperComponent load={loadProps} {...this.props} />}
          </LoadConsumer>
        </LoadProvider>
      );
    }
  };
  Comp = hoistNonReactStatics(Comp, WrapperComponent);
  return Comp;
}
