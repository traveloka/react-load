export default function decorate(thing: any, decorators: any) {
  const target = typeof thing === 'function' ? thing.prototype : thing;
  for (const prop in decorators) {
    if (decorators[prop]) {
      let propertyDecorators = decorators[prop];
      if (!Array.isArray(propertyDecorators)) {
        propertyDecorators = [propertyDecorators];
      }
      const descriptor = Object.getOwnPropertyDescriptor(target, prop);
      const newDescriptor = propertyDecorators.reduce(
        (accDescriptor, decorator) => decorator(target, prop, accDescriptor),
        descriptor
      );
      if (newDescriptor) Object.defineProperty(target, prop, newDescriptor);
    }
  }
  return thing;
}
