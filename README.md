# A Project Status Board

A WIP attempt to centralize all the work being done in a community
of GitHub projects.  When you have work spread across multiple repos
and multiple orginizations, it is often hard to track things.  This
is what `@pkgjs/statusboard` aims to solve.

This upstream repository is managed by the [Package Maintenance Working Group](https://github.com/nodejs/package-maintenance), see [Governance](https://github.com/nodejs/package-maintenance/blob/master/Governance.md).


## This Fork

This fork has made significant fixes to usability and config, but still requires specifying a config manually. The codebase is very wonky with redirection upon abstraction upon redirection and is extremely challenging to navigate. The code is also using very old dependencies that need replaced, but at least it's working. 

The code in `lib/github.js`, `lib/db/build-index.js`'s `loadProject` function, and the `level` db saving (likely without the odd generator wrapper redux reducer pattern) should be stripped out and kept, and the rest thrown away during an eventual migration to typescript + vite + react. However, *maybe* this repo can be saved by including types.
