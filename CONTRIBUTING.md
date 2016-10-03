/* CONTRIBUTE */

# Contribute.md

## Core Team Members

* Jonathan Barton
* Nicholas Kanhai
* Isaac Zarsky
* Neha Abrol
* Morris Singer
* Jacob Bashista
* Matthew Kihm
* Rick Bresnahan

## Code of Conduct

See CODE_OF_CONDUCT.md in the base of this repository to read the covenant for interactions between contributors.

## Learn & Listen

* (goMake Forum)[https://muut.com/gomake#!/]
* Twitter: @gomaketeam 

## Adding New Features

* You can request a new feature by submitting an issue to our GitHub Issues for this repo. If you would like to implement a new feature, please submit an issue with a proposal for your work first, to be sure that we can use it.

* All new features 

## Bug Triage

* You can help report bugs by filing them in Github Issues for this repo. Existing bugs can also be reviewed there.

* You can help us diagnose and fix existing bugs by asking and providing answers for the following:

  * Is the bug reproducible as explained?   
  * Is it reproducible in other environments (for instance, on different browsers or devices)?   
  * Are the steps to reproduce the bug clear? If not, can you describe how you might reproduce it?  
  * What tags should the bug have?  
  * Is this bug something you have run into? Would you appreciate it being looked into faster?  

## Submitting a Pull Request (PR)

Before Submitting your PR

* Search the repo for an open or closed PR that relates to your submission. Avoid duplication of effort! 
* Make your commits in a new git branch:

```
  git checkout -b my-branch-name master
```

* Include appropriate test cases
* Make sure all new API methods or changes to existing methods are documented
* Squash commits into as few as possible per PR

PR Review

* At least one core team member must give you a :+1: or LGTM.
* Core team members will perform the PR merge

After Your PR is Merged

* Delete remote branch:

```
  git push origin --delete my-fix-branch
```

* Checkout master and delete local branch:

```
  git checkout master -f
  git branch -D my-fix-branch
```

* Update your master with the latest upstream version:

```
  git pull --ff upstream master
```

Update related Github Issues when completed:

* Comment any Github issues related to your PR with a message linking to the PR# (i.e. `Fixed by #13` or `Implemented in #12`)

## Beta Testing

* If you would like to be a beta tester, reach out to us on the beta-testing channel of our (forum)[https://muut.com/gomake#!/]

