 # 🐯 Tiger Router 🐯
[![Licencia ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
![Versión](https://img.shields.io/npm/v/tiger-router)

[Web](https://www.npmjs.com/package/tiger-router)


Introducing Tiger Router, the sleek and minimalist routing solution for React. Say goodbye to bloated and complicated routing libraries - Tiger Router offers only the essentials for seamless navigation within your React application. With its intuitive and user-friendly interface, you can easily define your routes and render your components with just a few lines of code. So why settle for anything less? Choose Tiger Router for a streamlined routing experience that's truly roar-some. 🐯


Tiger Router allows you to use Router, Route, and Link components in your projects.


## Installation

You can install Tiger Router using npm or yarn:

`npm install tiger-router`

`yarn add tiger-router`

## Getting Started

To use Tiger Router in your project, follow these steps:

1. Import the Router component from the tiger-router package:

```js
import { Router } from 'tiger-router';
```

2. Wrap your application's components with the Router component, passing in the URL path and component to render as props:

```js
import { Router, Route } from 'tiger-router';
import Home from './components/Home';
import About from './components/About';

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  );
}

export default App;
```

3. Use the Link component to navigate between routes:

```js
import { Link } from 'tiger-router';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
```

<h3>That's it! You should now be able to use Tiger Router in your project!</h3>

# Contributing

If you would like to help us, please take a moment to read the [CONTRIBUTING.md](https://github.com/Fasping/tiger-router/blob/main/CONTRIBUTING.md) file. You will find useful information there on how to effectively contribute and follow our style guides. We hope you enjoy collaborating with us!


<h3> Cheers 🍻 !!! </h3>
