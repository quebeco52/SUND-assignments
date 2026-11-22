## Question: What do on , runs-on , strategy.matrix and steps do? Why did nothing happen when you only pushed the branch?

on: defines the trigger
runs-on: picks the what os to run on
strategy.matrix: Runs the job multiple times, once per Node version in this case
steps: The sequential list of actions and commands

I did nothing because we did not have a ci.yml

## Question: Why can a test pass on your laptop but fail in CI? Think of why the video's first run failed.

CI runs clean Linux VM so it is not one to one, so for example node version mismatch can happen


## Question: Why is a red cross on the pull request better than one after merging?

It catch the bug before it makes it in to main

## Question: Would this step have caught the possibly null bug from Week 11, Exercise 9?

No because we wrote that one in js

## Question: What's the difference between npm ci and npm install , and why does CI use npm ci ?

npm install reads package.json and "update" it and updates package-lock.json and keeps node_modules.

npm ci deletes node_modules and installs the exact versions from package-lock.json and does not touch package-lock.json

Reproducible builds. it will have the exact versions

## Question: What does branch protection do that CI alone can't?

CI alone reports, Branch protection protects the branch by enforcing  policy