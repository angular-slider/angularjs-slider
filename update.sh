#!/bin/bash

git checkout master -- .gitignore

git co master -- demo/demo.css
# git co master -- demo/index.html
git co master -- dist/rzslider.css
git co master -- dist/rzslider.css
git co master -- rzslider.js

mv demo/demo.css demo.css
mv demo/index.html index.html
mv dist/rzslider.css rzslider.css

cp bower_components/angular/angular.min.js angular.min.js

rm -rf demo
rm -rf dist
