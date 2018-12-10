# React Load

[![CircleCI](https://circleci.com/gh/traveloka/react-load/tree/master.svg?style=shield&circle-token=ab2fa2d1fdea74636ee3132e16c82003cdc95383)](https://circleci.com/gh/traveloka/react-load)

Remove boilerplate handling loading, error, and result state of Promise!

---

## Table of contents

- [React Load](#react-load)
  - [Table of contents](#table-of-contents)
  - [How to use](#how-to-use)
      - [Setup](#setup)
  - [Motivation](#motivation)
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


### Example

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
}

decorate(UserListPage, {
  componentDidMount: load(),
});

export default load()(UserListPage);
```

## Documentations


#### Given Props
| Property  | Type      | Default Value | Description |
| --------- | --------- | ------------- | ----------- |
| isLoading | boolean   | false         |             |
| isError   | boolean   | false         |             |
| error     | Exception | null          |             |
| result    | any       | null          |             |
| retry     | function  | () => {}      |             |


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

