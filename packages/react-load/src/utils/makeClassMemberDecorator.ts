/**
 * inspired by : https://github.com/NYTimes/react-tracking
 *
 *
 * Helper to decorate class member
 * Supports class plain methods, field syntax and lazy methods
 * @param {Function} decorate Actual decorator function.
 * Example:
 *   decoratedFn => function () {
 *     // do stuff...
 *     return Object.apply(decoratedFn, this, arguments);
 *   }
 * @returns {Function} Class member decorator ((target, name, descriptor) => newDescriptor)
 */
export default function makeClassMemberDecorator(decorate: any) {
  return function decorateClassMember(target: any, name: any, descriptor: any): any {
    const { configurable, enumerable, value, get, initializer } = descriptor;
    if (value) {
      return {
        configurable,
        enumerable,
        value: decorate(value),
        writable: true,
      };
    }

    // support lazy initializer
    if (get || initializer) {
      return {
        configurable,
        enumerable,
        get() {
          // This happens if someone accesses the
          // property directly on the prototype
          if (this === target) {
            return null;
          }

          const resolvedValue = initializer ? initializer.apply(this, []) : get.apply(this, []);
          const decoratedValue = decorate(resolvedValue).bind(this);

          Object.defineProperty(this, name, {
            configurable,
            enumerable,
            value: decoratedValue,
            writable: true,
          });

          return decoratedValue;
        },
      };
    }

    throw new Error('called makeClassMemberDecorator on unsupported descriptor');
  };
}
