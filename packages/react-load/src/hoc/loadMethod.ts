import { K_DEFAULT_KEY } from './../LoadContext';
import has = require('lodash/has');
import makeClassMemberDecorator from '../utils/makeClassMemberDecorator';
import log from '../utils/log';

export default function loadMethod(key: string = K_DEFAULT_KEY) {
  return makeClassMemberDecorator(function decorate(decoratedFn: any) {
    return function decorateClassMember(this: any) {
      const args = arguments;
      log('LOAD METHOD', 'entry');
      return new Promise((resolve, reject) => {
        if (!has(this.props, 'load')) {
          reject("Component didn't have decorator load.");
        }
        const { setLoadingByKey, setErrorByKey, setResultByKey } = this.props.load;
        setLoadingByKey(key, true);
        log('LOAD METHOD', 'execute');
        try {
          return Promise.resolve(decoratedFn.apply(this, args))
            .then(result => {
              log('LOAD METHOD', 'done');
              setResultByKey(key, result);
              resolve(result);
            })
            .catch(error => {
              log('LOAD METHOD', 'error');
              const retryFn = decorateClassMember.bind(this);
              setErrorByKey(key, error, () => {
                log('LOAD METHOD', 'retry');
                return retryFn.apply(this, args);
              });
              return resolve();
            });
        } catch (error) {
          log('LOAD METHOD', 'error');
          const retryFn = decorateClassMember.bind(this);
          setErrorByKey(key, error, () => {
            log('LOAD METHOD', 'retry');
            return retryFn.apply(this, args);
          });
          return resolve();
        }
      });
    };
  });
}
