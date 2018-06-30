## Reporting issues

Make sure the report is accompanied by a reproducible demo. The ideal demo is created by forking [our standard jsFiddle](http://jsfiddle.net/cwhgLcjv/), adding your own code and stripping it down to an absolute minimum needed to demonstrate the bug.

## Prettier

This project use [Prettier](https://github.com/prettier/prettier) for its code formatting. The goal is to be sure that all code pushed to this repository has the same style. A git hook is set up to format all the edited files on commit.

## Submittting a Pull Request

To contribute to the project, please follow these steps:

1.  Get approval for the idea by filing an issue and talking with me about the changes
2.  Fork the repo
3.  Make a branch for your change
4.  Run `yarn`
5.  Run `yarn test`
6.  Make your changes
7.  Test your changes (if you need a new test file, please copy the `test-template.js` file in the tests/specs folder.)
8.  Run `yarn build` to generate the dist files
9.  Run `git add -A` to add your changes
10. Run `yarn commit` (**Do not** use `git commit`) - follow the prompts to create your git message
11. Push your changes with `git push`
12. Create the Pull Request (a demo showing what the PR does is always good so you can fork [this fiddle](http://jsfiddle.net/cwhgLcjv/))
13. If there are several commits, please [rebase](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request) and [squash](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request#squash-your-changes) everything to only get one commit.
14. Get merged and celebrate

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)
