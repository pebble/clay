# Contributing

Thanks for checking out Clay. We accept pull requests from anybody, however we ask
that you follow some conventions when contributing to Clay.

We have set up a
[piece-of-cake](https://github.com/pebble/clay/issues?q=is%3Aopen+is%3Aissue+label%3Apiece-of-cake)
label in GitHub issues for bugs/features that are easy to implement. These issues are
a great place to start for people that are new to the codebase.


## Requirements

 - [Node](https://nodejs.org) (4.0 and later)
 - [Google Chrome](www.google.com/chrome) (To run tests)
 - [Pebble SDK](https://developer.pebble.com/sdk/) (optional)


## Getting Started

### 1. Fork, then clone the repo:

`$ git clone git@github.com:your-username/clay.git`

### 2. Create a new branch with the following naming convention.

`#<issue-id>/description-of-change`

example:

`#90/support-message-keys`

If there is currently no GitHub issue open for your proposed contribution,
then please make one. This allows us to assign milestones and triage priority.

### 3. Install the project dependencies.

`$ npm install`

### 4. Develop your feature

Commit as often as you like. Your branch will be squashed when the pull request is merged.

### 5. Run the tests

`$ npm run test`

### 6. Run linting

`$ npm run lint`

### 7. Submit your pull request

In the main comment of the pull request, you must state the GitHub issue that your PR
resolves. You do this by using the syntax `Resolves #<issue-id>`. An example of this
can be found [here](https://github.com/pebble/clay/pull/81)



# Project Structure and Development


## Important Files

There are two main entry points for Clay - `index.js` and `src/scripts/config-page.js`.

### index.js

This is the main entry point for the code that will run in the Pebble app's `src/js/app.js`.
It is responsible for serializing the provided config into a data URI that will be opened
using `Pebble.openURL()`. It also persists data to `localStorage`.

### src/scripts/config-page.js

This is the main entry point for the code that runs on the generated config page,
and is responsible for passing the injected config and other components to the
`ClayConfig` class.


## Building

Use the following command to build Clay during development.

`$ npm run dev`

This command packages up `src/scripts/config-page.js` and `dev/dev.js` into the `tmp/` directory
so `dev/dev.html` can include them as script tags. This will also watch for changes
in the project.

While developing components and other functionality for Clay, it is much easier to
work with the files in the `dev/` directory than on a phone or emulator. Below is
an explanation of the files and their purpose.

| File | Purpose |
|----------|-----|
| `dev.html` | Open this page in a browser after running `$ npm run dev`. |
| `dev.js` | Injects the components and dependencies into the window the same way `index.js` would. |
| `config.js` | Clay config to use as a sandbox for testing components. |
| `custom-fn.js` | Clay custom function to be injected by `dev.js`. |
| `emulator.html` | Copy of the HTML page that is used to make the Clay compatible with the Pebble SDK emulator. |
| `uri-test.html` | Used to stress test URI creation for older browser versions. |


## Testing your change inside of a test project.

Once your change is ready to be tested in the emulator or on the watch, follow these steps:

1. From your Clay fork run `$ npm run pebble-build`. This builds Clay to work with the Pebble SDK
2. From your test Pebble project, run `$ pebble package install /path/to/your/clay/fork`.
  This will modify your `package.json` to point directly to your local copy of Clay.
3. Run the usual`$ pebble build && pebble install --emulator basalt && pebble emu-app-config` to test your modifications
4. If you make modifications to your fork of Clay, you must repeat the above steps.


## Functionality

Most of the magic happens in the `src/scripts/lib` directory. `config-page.js`
initializes a new instance of `ClayConfig` and calls the injected custom function
(`window.customFn`) with the `ClayConfig` as its context. This allows developers to
add extra functionality to the config page, such as setting values of items dynamically
or registering small custom components.

Once the `ClayConfig` is initialized, we run the `.build()` method. This iterates over
the config and injects each item into the page. Each item is an instance of `ClayItem`.
It also indexes the items to later be retrieved with `.getAllItems()`,
`.getItemByMessageKey()`, `.getItemById()`, `.getItemsByType()`.


## Testing

Clay enforces 100% test coverage. Chances are, that if you are submitting a pull request,
there should be tests for the proposed code changes. Have a look at the other tests in
the repository to see some examples of how you should be writing your tests.

There are two commands to use while writing your tests.

 - `$ npm run test` - Runs all tests once.
 - `$ npm run test-debug` - Watches for file changes and re-runs all tests when it
  detects a change. This also leaves an in instance of Google Chrome running.
  If you click the "Debug" button in the top right of the page, a new tab will open.
  You can then use the Google Chrome developer tools to debug your tests as they run.
  Refreshing the page will re-run the tests.

## Style Guide

Have a look at the rest of the codebase for an example of how you should format your code.
Our style guide is enforced using ESLint. Run `$ npm run lint` to ensure you are
adhering to the style guide.
