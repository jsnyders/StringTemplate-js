# StringTemplate v4 for JavaScript

Under construction

This will be a pure JavaScript implementation of [StringTemplate v4](http://www.stringtemplate.org/).
Templates will be compiled to JavaScript. The intent is to be fully compatible with StringTemplate
syntax. This means that the same template processed with the same data should produce the same
output when processed with the Java (reference implementation) and this JavaScript implementation.
See below for known differences. The API will **not** be compatible with the Java implementation.  

## Update 26-Jul

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

TBD for now download or fork the project
use npm link to add stc as a global command or you can give the path to stc in the bin folder

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
 
* Step 2 Execute the compiled template. This can be done with the JavaScript version of stst that is in the bin folder.

```
cd samples/hello
../../bin/stst hello hello.json
```

The first argument is the template name without the _stg.js suffix. The second argument is a JSON file that supplies
the data for the template.

NOTE: The JavaScript version of stst is very rough. Ignore the debugging output for now.

To execute the template from your application:

```
cd samples/hello
node
var st = require("../../lib/stRuntime");
var g = st.loadGroup(require("./hello_stg"));
console.log(g.render("hello", ["world"]);
// or
console.log(g.render("hello", {audience:"world"});
```

## API
tbd


## Building

Additional development dependencies: need grunt-cli, mocha and pegjs installed globally


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

