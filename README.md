# React Load

![NPM Version](https://badge.fury.io/js/%40traveloka%2Freact-load.svg) [![CircleCI](https://circleci.com/gh/traveloka/react-load/tree/master.svg?style=shield)](https://circleci.com/gh/traveloka/react-load) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Remove boilerplate handling loading, error, and result state of Promise!

---

## Table of contents

- [React Load](#react-load)
  - [Table of contents](#table-of-contents)
  - [How to use](#how-to-use)
      - [Setup](#setup)
  - [Motivation](#motivation)
    - [Hooks](#hooks)
      - [useLoad()](#useload)
    - [Example](#example)
  - [Documentations](#documentations)
      - [Given Props](#given-props)
  - [How to (not) use decorators](#how-to-not-use-decorators)
  - [Babel: manually enabling decorators](#babel-manually-enabling-decorators)
  - [Credits](#credits)

---

## How to use

#### Setup

using npm:

```
npm install @traveloka/react-load --save
```

using yarn:

```
yarn add @traveloka/react-load
```

## Motivation

> “The best products don’t focus on features, they focus on clarity.”
> — Jon Bolt

Providing loading state, error, and result callback of a Javascript Promise is common in any application.

In ES6, there's a [Promise](https://www.datchley.name/es6-promises/) that do some async function. Lot of duplicate code being used to get the state before the async function executed, and state of Promise error / Promise success state when async function is done.

This library will give a property state before and after execution of async function.


### Hooks
#### useLoad()
```typescript
const {
  isLoading: boolean,
  isError: boolean,
  error: Error | null,
  retry: () => void,
  result: T | null,
  trigger: (...args: any[]) => Promise<T>
} = useLoad<T>((...args: any[]) => Promise<T>)

```
Example
```javascript
import React, { useEffect } from 'react';
import { useLoad } from '@traveloka/react-load';

export default function UserListPage(props) {
  const { isLoading, isError, error, retry, result, trigger } = useLoad(fetchUserList);
  useEffect(() => {
    trigger(); // call the fetchUserList that wrapped with load attributes
  });
  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} retry={retry} />
  return (
    ....
  );
}
```

### Example

[![Example 1](https://i.imgur.com/BHQnV3N.png)](https://codesandbox.io/s/nrn3opw66j)

[![Example 2](https://i.imgur.com/s5YPdDB.png)](https://codesandbox.io/s/71myqxl1lx)

- With decorator

```javascript
import React from 'react';
import { load } from '@traveloka/react-load';

@load()
export default class UserListPage extends React.Component {
  @load()
  componentDidMount() {
    return fetchUserList(); // Note: must return a Promise
  }

  render() {
    const { load: { isLoading, isError, error, retry, result} } = this.props;
    if (isLoading) return <LoadingPage />
    if (isError) return <ErrorPage error={error} retry={retry} />
    return (
      ....
    );
  }
}
```

- Without decorator

```javascript
import React from 'react';
import { load, decorate } from '@traveloka/react-load';

class UserListPage extends React.Component {
  componentDidMount() {
    return fetchUserList();
  }

  render() {
    const { load: { isLoading, isError, error, retry, result} } = this.props;
    if (isLoading) return <LoadingPage />
    if (isError) return <ErrorPage error={error} retry={retry} />
    return (
      ....
    );
  }
}

decorate(UserListPage, {
  componentDidMount: load(),
});

export default load()(UserListPage);
```

## Documentations


#### Given Props

| Property         | Type      | Default Value | Description |
| ---------------- | --------- | ------------- | ----------- |
| `load.isLoading` | boolean   | false         |             |
| `load.isError`   | boolean   | false         |             |
| `load.error`     | Exception | null          |             |
| `load.result`    | any       | null          |             |
| `load.retry`     | function  | () => {}      |             |


## How to (not) use decorators

Using ES.next decorators is optional. This section explains how to use them, or how to avoid them.

Advantages of using decorators:

- Minimizes boilerplate, declarative.
- Easy to use and read. A majority of the MobX users use them.

Disadvantages of using decorators:

- Stage-2 ES.next feature
- Requires a little setup and transpilation, only supported with Babel / Typescript transpilation so far

You can approach using decorators in two ways:

- Enable the currently experimental decorator syntax in your compiler (read on)
- Don't enable decorator syntax, but leverage the built-in utility decorate to apply decorators to your classes / objects.

Using decorator syntax:

```javascript
import * as React from 'react';
import { load } from '@traveloka/react-load';

@load()
class Timer extends React.Component {
  @load()
  componentDidMount() {
    /* ... */
  }

  render() {
    const { load: { isLoading, isError, error, retry, result} } = this.props;
    /* ... */
  }
}
```

Using the `decorate` utility:

```javascript
import compose from 'lodash/fp/compose';
import { load, decorate } from '@traveloka/react-load';

class Timer extends React.Component {
  componentDidMount() {
    /* ... */
  }

  render() {
    /* ... */
  }
}

// decorate method
decorate(Timer, {
  componentDidMount: load(),
});

export default load()(Timer);
```

## Babel: manually enabling decorators

To enable support for decorators, follow the following steps. Install support for decorators: `npm i --save-dev babel-plugin-transform-decorators-legacy`. And enable it in your `.babelrc` file:

```
{
  "presets": [
    "es2015",
    "stage-1"
  ],
  "plugins": ["transform-decorators-legacy"]
}
```

Note that the order of plugins is important: `transform-decorators-legacy` should be listed first. Having issues with the babel setup? Check this [issue](https://github.com/mobxjs/mobx/issues/105) first.

For babel 7, see issue [1352](https://github.com/mobxjs/mobx/issues/1352) for an example setup.

## Credits
Written by [Jacky Wijaya](https://www.linkedin.com/in/jacky-wijaya-125b90b6/) (@jekiwijaya) at Traveloka.

