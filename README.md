# StringTemplate v4 for JavaScript

stringtemplate-js is a pure JavaScript implementation of [StringTemplate v4](http://www.stringtemplate.org/).
Templates are compiled to JavaScript. The intent is to be fully compatible with StringTemplate
syntax. This means that the same template processed with the same data should produce the same
output when processed with the Java (reference implementation) and this JavaScript implementation.
See below for known differences. The API will **not** be compatible with the Java implementation.  

# News

## 7-Nov
Tested with Node 4.2.2. Unit tests pass and seems working fine.

## 9-Aug
Version 0.1.1 ready for alpha testing. Feel free to use github Issues to report problems or make suggestions.
Template regions not yet supported.

## 30-Jul
Apologies to anyone who downloaded the 0.1.0 version I added to npm. It does not work as is. 
It may work if you compile the pegjs grammer. I plan to update the version on npm soon.

## 26-Jul

Major milestone. StringTemplate-js now uses itself to generate compiled templates.
It was able to pass all unit tests without using the Java version of StringTemplate for code generation! 

What works at least a little

* compile and process directory of template files (.st)
* compile and process directory of raw template files (.st)
* compile and process group file (.stg)
* configurable start, stop delimiters and escaping delimiters
* comments
* dictionaries
* literals string, true, false, lists
* escapes such as $\t$ and $\\\\$
* attribute expressions including implicit iteration over list/array attributes
* property reference expressions
* if, else if, else conditions including &&, ||, !
* imports
* template include expressions and argument passing by position or name and pass through (...)
* expression options
* sub templates
* map expressions
* rotating through templates while mapping 
* function expressions
* auto indent writer
* indirect property reference
* indirect template include
* zipping multiple lists/arrays while mapping

What doesn't work or isn't tested

* regions

Nest step is to stabilize, and release first version without support for regions so other can try it out. 
Then come back and implement regions.

## License
BSD

## Install

StringTemplate adds two command line utilities. The template compiler `stc` and standalone tool `stst` for testing 
templates with JSON input. For that reason it is best to install globally.

npm install -g stringtemplate-js

If you don't install globally links to the stc and stst commands are in the node_modules/.bin folder.

## Using

The file samples/hello/hello.st contains (with comments removed):

```
hello(audience) ::= <<Hello $audience;null="is anyone there?"$!

>>
```

* Step 1 compile the templates using the stc command. For example:

```
cd samples/hello
stc hello.st
```

This produces `hello_stg.js` in the same folder. Type `stc -h` for help on stc command line options.

Templates can also be compiled from your own application using the API in compiler/stc.js. Grunt task TBD.
 
* Step 2 Execute the compiled template. This can be done with stst that is in the bin folder.

```
cd samples/hello
stst hello hello.json
```

The first argument is the template name without the _stg.js suffix. The second argument is a JSON file that supplies
the data for the template. Type `stst -h` for help on stst command line options.

To execute the template from your application add code similar to the following:

```
cd samples/hello
node
var st = require("stringtemplate-js");
var g = st.loadGroup(require("./hello_stg"));
console.log(g.render("hello", ["world"]);
// or
console.log(g.render("hello", {audience:"world"});
```

## API
tbd


## Building

Additional development dependencies: need grunt-cli, mocha and pegjs installed globally

## Run unit tests

To run the unit tests, using mocha, you need also the STSTv4 tool to launch StringTemplate from command line. For several test StringTemplate-js run the same test against the reference implementation in java of StringTemplate and then compares the output.

1. install or build from source the STSTv4 tool.

1. the testing code expects to find the ``stst_java`` command in your ``PATH``. On Unix you can copy it from the STSTv4 project (``stst.sh``) and edit the STST_HOME variable:

   ```
   StringTemplate-js $ cp ../STSTv4/stst.sh stst_java
   StringTemplate-js $ grep "STST_HOME=" stst_java
   STST_HOME=$( cd "$( dirname $0 )" && pwd )
   StringTemplate-js $ vi stst_java
   StringTemplate-js $ grep "STST_HOME=" stst_java
   STST_HOME=/opt/working-dir/STSTv4   # Put here where STSTv4 is installed, this is mine.
   ```

1. install the required npm packages:
   ```
   StringTemplate-js $ npm install yargs
   ```

1. you need to compile the ``.stg`` files used for tests:
   ```
   StringTemplate-js $ cd test/
   StringTemplate-js/test $ ../bin/stc include.stg
   StringTemplate-js/test $ ../bin/stc testGroup.stg
   StringTemplate-js/test $ cd ..
   ```

1. test the stst_java script:

   ```
   StringTemplate-js $ echo "{\"arg1\": {\"hasTitle\": true, \"title\": \"Mr\", \"first\": \"Sam\", \"last\": \"Smith\"}}" | stst_java -t test testGroup.simple
   Greeting: Mr [Sam], [Smith]
       Body
   marco@lizard /opt/working-dir/StringTemplate-js $
   ```

1. now you can run the tests suite:

   ```
   StringTemplate-js $ grunt mochaTest
   Running "mochaTest:all" (mochaTest) task

   [..snip..]

   175 passing (2s)

   Done, without errors.
   ```

## Known Differences
This section lists differences between this implementation and the Java reference implementation

* The Java AutoIndentWriter will strip lone cr (\r) from the output. This autoIndentWriter normalizes lone cr to the 
OS new line. A lone cr may be unlikely. One way to get one is with $"\r"$.

* The Java implementation allows any start or stop delimiter even if they will later cause confusion. 
This implementation restricts the delimiters to "#$%^&*<>"

* The JavaScript implementation doesn't support the old v3 style group file header

* The order in which object properties (or map/dictionary keys) are iterated over may be different. 
For example $obj:T()$  when obj is { "a": "foo", "b": "bar"} could call template T 
with ["a", "b"] or ["b", "a"]. The JavaScript implementation will iterate over object
properties in the order returned by Object.keys(obj);

