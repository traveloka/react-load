export default function decorate(thing: any, decorators: any) {
  const target = typeof thing === 'function' ? thing.prototype : thing;
  for (const prop in decorators) {
    if (decorators[prop]) {
      const decorator = decorators[prop];
      const descriptor = Object.getOwnPropertyDescriptor(target, prop);
      const newDescriptor = decorator(target, prop, descriptor);
      if (newDescriptor) Object.defineProperty(target, prop, newDescriptor);
    }
  }
  return thing;
}
