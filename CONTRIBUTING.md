# Contributing to Tiger Router 🐯

## Introduction

Thank you for considering contributing to Tiger Router! We appreciate any help, big or small, and are grateful for your time and effort. This document outlines the guidelines for contributing to the project, as well as the process for submitting pull requests.

## How Can I Contribute? 😊

There are many ways you can contribute to Tiger Router, including:

- Reporting bugs and submitting feature requests.
- Writing documentation.
- Improving the test coverage of the codebase.
- Submitting code changes and bug fixes.

## Getting Started 🚀

```bash
npm install
npm run dev     # demo app at http://localhost:5173
npm test        # unit + render tests (watch mode: npm run test:watch)
npm run verify  # everything CI runs
```

Requires Node 20 or newer.

### Project layout

```
src/
  core/     framework-agnostic: history store, route matcher, path helpers
  react/    React bindings: Router, Routes, Route, Link, NavLink, Navigate, hooks
  demo/     the local playground you see with npm run dev
  index.ts  public API — anything not exported here is internal
```

The rule of thumb: logic that does not need React lives in `core/` and is unit
tested there; `react/` stays as thin as possible and is covered by render tests.

### Useful scripts

| Script                  | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `npm run lint`          | Biome lint + format check                           |
| `npm run lint:fix`      | Apply every safe fix                                |
| `npm run typecheck`     | `tsc --noEmit`                                      |
| `npm run test:coverage` | Tests with coverage thresholds                      |
| `npm run build`         | Build `dist/` with tsup (ESM + CJS + types)         |
| `npm run check:package` | `publint` + `attw` on the packed tarball            |
| `npm run size`          | Bundle-size budget                                  |

## Submitting Changes 🛠

Before you submit a pull request, please make sure to do the following:

- Run `npm run verify` — it runs lint, types, tests, build and the size budget.
- Write tests for any new code you have added.
- Add an entry to `CHANGELOG.md` under an `Unreleased` heading.
- Update the documentation to reflect any changes (recommended).

Formatting is handled by [Biome](https://biomejs.dev), so there is no style debate:
run `npm run lint:fix` and move on.

## Pull Request Process 🚀

- Fork the repository and create a new branch for your changes.
- Make the necessary changes, and commit your code with a clear commit message.
- Push your changes to your fork.
- Submit a pull request to the main repository.
- The repository maintainers will review your pull request and may request changes or improvements.
- Once the changes have been made and the pull request has been approved, it will be merged into the main branch.

## Git Commit Conduct 📝

When writing commit messages, please follow these best practices:

- Use the imperative mood in your commit message. For example, "Fix bug" instead of "Fixed bug" or "Fixes bug".
- Avoid using exclamation points or question marks in your commit message.
- Keep your commit message short and concise, ideally no more than 50 characters.
- Use the commit message body to provide any necessary context or details about the commit.
- Use prefixes in your commit messages to make them more semantic. Some common prefixes include:

  - "`feat`" for new features.
  - "`fix`" for bug fixes.
  - "`perf`" for performance improvements.
  - "`build`" for changes to the build system.
  - "`ci`" for continuous integration - changes,
  - "`docs`" for documentation changes.
  - "`refactor`" for refactoring changes.
  - "`style`" for formatting changes.
  - "`test`" for changes to tests.

For more information about writing good commit messages, you can refer to [this link](https://www.conventionalcommits.org/en/v1.0.0/).

## Reporting Bugs 🐛

If you've found a bug in Tiger Router, we would appreciate it if you could report it to us. To report a bug, please follow these steps:

1. Check the existing issues in the repository to see if the bug has already been reported. If it has, you can add your additional information to the existing issue.
2. If the bug has not been reported, create a new issue and provide a clear and concise description of the problem.
3. Include any relevant details, such as the version of the API you are using, the platform you are using (e.g. Windows, Mac, Linux), and the steps to reproduce the bug.
4. If possible, include any error messages or logs that may be relevant to the problem.
