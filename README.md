# StringTemplate v4 for JavaScript

Under construction

This will be a pure JavaScript implementation of [StringTemplate v4](http://www.stringtemplate.org/).
Templates will be compiled to JavaScript. The intent is to be fully compatible with StringTemplate
syntax. This means that the same template processed with the same data should produce the same
output when processed with the Java (reference implementation) and this JavaScript implementation.
See below for known differences. The API will **not** be compatible with the Java implementation.  

## Update 12-Jun

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

What doesn't work or isn't tested

* indirect property reference
* indirect template include
* zipping multiple lists/arrays while mapping
* regions

## Install

TBD for now download or fork the project
use npm link to add stc as a global command or you can give the path to stc in the bin folder

## Using

* Step 1 compile the templates using the stc command. For example:

```
cd samples/hello
stc hello.st
```

This produces `hello_stg.js` in the same folder. Type `stc -h` for help on stc command line options.

Templates can also be compiled from your own application using the API in compiler/stc.js. Grunt task TBD.

NOTE: Currently the Java [stst](https://github.com/jsnyders/STSTv4) program is needed to bootstrap compiling because
StringTemplate is used to generate the compiled template JavaScript code. Make sure you have the latest stst installed
so that it runs with the command `stst`. Ignore the runtime errors output by stst.
 
* Step 2 Execute the compiled template. This can be done with the JavaScript version of stst that is in the bin folder.

```
cd samples/hello
../../bin/stst hello hello.json
```

The first argument is the template name without the _stg.js suffix. The second argument is a JSON file that supplies
the data for the template.

NOTE: The JavaScript version of stst is very rough. Ignore the debugging output for now.

To execute the template from your application TBD the following code is a little out of date. Take a look at the unit tests.

```
node
var t, st = require("./lib/stRuntime"),
    w = require("./lib/autoIndentWriter"),
    inc_stg = require("./test/include_stg"),
    group = st.loadGroup(inc_stg),
    writer = w.makeWriter();
t = group.getTemplate("/main");
t.add("arg1", {
    first: "Max",
    last: "Smith"
});
t.write(writer);
console.log(writer.toString());
```


## License
BSD

## Building

Additional development dependencies: need grunt-cli, mocha and pegjs installed globally


## Known Differences
This section lists differences between this implementation and the Java reference implementation

* The Java AutoIndentWriter will strip lone cr (\r) from the output. This autoIndentWriter normalizes lone cr to the 
OS new line. A lone cr may be unlikely. One way to get one is with $"\r"$.

* The Java implementation allows any start or stop delimiter even if they will later cause confusion. 
This implementation restricts the delimiters to "#$%^&*<>"

* The JavaScript implementation doesn't support the old v3 style group file header
