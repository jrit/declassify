'use strict';

var cssom = require('cssom');
var cheerio = require('cheerio');

var declassify = {};

module.exports = declassify;
var idRuleRegex = /(\#)(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)\b/g;
var classRuleRegex = /(\.)(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)\b/g;

var getRuleName = function(rule, selector) {
  var ruleNames = [];
  var matches;
  var selectorText = rule.selectorText;
  var ruleRegex = selector === 'id' ? idRuleRegex : classRuleRegex;

  while ((matches = ruleRegex.exec(selectorText)) !== null) {
    var i = 2;
    while (matches[i]) {
      ruleNames.push(matches[i]);
      i++;
    }
  }

  return ruleNames;
};

var getRules = function(cssomRules, selector) {
  var result = [];
  for (var i = 0, l = cssomRules.length; i < l; i++) {
    var rule = cssomRules[i];
    if (rule.selectorText) {
      var ruleName = getRuleName(rule, selector);
      ruleName.forEach(function(name) {
        result.push(name);
      });
    } else if (rule.media && rule.cssRules) {
      result = result.concat(getRules(rule.cssRules, selector));
    }
  }
  return result;
};

declassify.getInUseAttr = function(css, selector) {
  var rules = cssom.parse(css).cssRules;

  if (!rules) {
    return [];
  }

  return getRules(rules, selector);
};

declassify.pruneAttr = function(attrName, $, ignore) {
  var $items = $('[' + attrName + ']');
  var css = [];
  $('style').each(function() {
    css.push($(this).text());
  });
  css = css.join('\n');

  var inUse = declassify.getInUseAttr(css, attrName);

  $items.each(function() {
    var $item = $(this);
    if (!$item.attr(attrName)) {
      return;
    }

    var tokens = $item.attr(attrName).split(' ');
    for (var tokenIndex = tokens.length; tokenIndex >= 0; tokenIndex--) {
      var isIgnored = false;
      for (var ignoreIndex = ignore.length; ignoreIndex >= 0; ignoreIndex--) {
        if (ignore[ignoreIndex] instanceof RegExp && ignore[ignoreIndex].test(tokens[tokenIndex])) {
          isIgnored = true;
        } else if (ignore[ignoreIndex] === tokens[tokenIndex]) {
          isIgnored = true;
        }
      }

      if (inUse.indexOf(tokens[tokenIndex]) === -1 && !isIgnored) {
        tokens.splice(tokenIndex, 1);
      }
    };

    if (tokens.length) {
      $item.attr(attrName, tokens.join(' '));
    } else {
      $item.removeAttr(attrName);
    }
  });
};

declassify.pruneAttrs = function(attrNames, $, ignore) {
  attrNames.forEach(function(attr) {
    declassify.pruneAttr(attr, $, ignore);
  });
};

declassify.process = function(htmlInput, options) {
  if (options === void 0) options = {};

  var $ = cheerio.load(htmlInput, {decodeEntities: false});
  var ignore = options.ignore || [];
  var attrs = options.attrs || ['id', 'class'];
  declassify.pruneAttrs(attrs, $, ignore);
  return $.html({decodeEntities: false});
};
