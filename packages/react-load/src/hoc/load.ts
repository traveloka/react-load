import { K_DEFAULT_KEY } from './../LoadContext';
import loadMethod from './loadMethod';
import loadClass from './loadClass';

export default function load(key: string = K_DEFAULT_KEY): any {
  return function(a: any, b: any, c: any) {
    if (!b) {
      // decorating a class
      return loadClass(a);
    }
    // decorating a method
    return loadMethod(key)(a, b, c);
  };
}
