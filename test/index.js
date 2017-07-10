'use strict';

var declassify = require('../');
var assert = require('assert');
var fs = require('fs');
var path = require('path');


it('processes the HTML', function() {
  var input = fs.readFileSync(
      path.join(__dirname, 'assets', 'standard.in.html'), 'utf8');

  var expected = fs.readFileSync(
      path.join(__dirname, 'assets', 'standard.out.html'), 'utf8');

  var result = declassify.process(input);

  assert.equal(result, expected);
});

it('processes the HTML with compound rules', function() {
  var input = fs.readFileSync(
      path.join(__dirname, 'assets', 'compound.in.html'), 'utf8');

  var expected = fs.readFileSync(
      path.join(__dirname, 'assets', 'compound.out.html'), 'utf8');

  var result = declassify.process(input);

  assert.equal(result, expected);
});

