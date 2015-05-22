#!/bin/bash

git checkout master -- .gitignore

git checkout master -- demo/demo.css
# git checkout master -- demo/index.html
git checkout master -- dist/rzslider.css
git checkout master -- rzslider.js

mv demo/demo.css demo.css
# mv demo/index.html index.html
mv dist/rzslider.css rzslider.css

cp bower_components/angular/angular.min.js angular.min.js

rm -rf demo
rm -rf dist
