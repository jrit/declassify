# declassify

Remove any classes or IDs not found in CSS from HTML - modifies HTML, not CSS.

This only considers CSS contained in the HTML document inside `<style>` tags to be in use right now. Currently limited to modifying `class` and `id` attributes, so won't do anything with `[data]` or other attributes less commonly used in CSS.

`npm install declassify`

## Example

```js
var declassify = require('declassify');
var result = declassify.process(html);
```

Input:

```html
<html>
    <head>
        <style>
            .used-class { color: red; }
            #used-id { color: blue; }
        </style>
    </head>
    <body class="unused" style="color: black;">
        <div class="used-class unused-class"></div>
        <div id="used-id"></div>
    </body>
</html>
```

Output:

```html
<html>
    <head>
        <style>
            .used-class { color: red; }
            #used-id { color: blue; }
        </style>
    </head>
    <body style="color: black;"> // has removed class="unused"
        <div class="used-class"></div> // has removed unused-class
        <div id="used-id"></div>
    </body>
</html>
```

### Options

```js
var declassify = require('declassify');
var options = {
  ignore: [
    'ignored-class',
    /ignored-regex-class\-[0-9]+/,
    'ignored-id',
    /ignored-regex-id\-[0-9]+/
  ],
  attrs: ['id', 'class']
};
var result = declassify.process(html, options);
```

Input:

```html
<html>
    <head>
        <style>
            .used-class { color: gray; }
        </style>
    </head>
    <body id="unused-id" class="unused-class">
        <div class="unused-class ignored-class ignored-regex-class-1"></div>
        <div class="used-class ignored-class ignored-regex-class-2"></div>
        <div id="ignored-id"></div>
        <div id="ignored-regex-id-1"></div>
    </body>
</html>
```

Output:

```html
<html>
    <head>
        <style>
            .used-class { color: gray; }
        </style>
    </head>
    <body>
        <div class="ignored-class ignored-regex-class-1"></div>
        <div class="used-class ignored-class ignored-regex-class-2"></div>
        <div id="ignored-id"></div>
        <div id="ignored-regex-id-1"></div>
    </body>
</html>
```

There are some other methods exposed by the module which can be considered public and will be considered for versioning, but please see `index.js` if you think you might need to use any of them.


## MIT Licensed
