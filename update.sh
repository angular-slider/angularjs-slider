#!/bin/bash

git checkout master -- .gitignore

#git checkout master -- demo/*
git checkout master -- dist/rzslider.css
git checkout master -- dist/rzslider.js

mv dist/* ./

# cp bower_components/angular/angular.min.js angular.min.js

rm -rf demo
rm -rf dist
