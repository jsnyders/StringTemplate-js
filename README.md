# StringTemplate v4 for JavaScript

Under construction

This will be a pure JavaScript implementation of the [StringTemplate v4](http://www.stringtemplate.org/).
Templates will be compiled to JavaScript

## Update 4-Jun

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
* sub templates (not too well tested especially with map or passing args)
* map expressions (not too well tested)
* function expressions
* auto indent writer

What doesn't work or isn't tested

* indirect property reference
* indirect template include
* rotating through templates while mapping 
* zippin multiple lists/arrays while mapping
* regions


## First Milestone

End to end processing of a simple template.

 * Step 1 Compile. Currently two steps using [stst](https://github.com/jsnyders/STSTv4) to bootstrap

```
node compiler/stc test/include.stg > test/include.stg.ast
stst -t compiler group.compiledGroup test/include.stg.ast > test/include_stg.js
```

This will be a single command once it is complete enough to compile its own code generation template.

Update: there is now a stc command in bin folder that does both steps (still uses Java stst to bootstrap)

 * Step 2 Execute the compiled template with the following. TODO look at simplifying the API and providing a 
 JavaScript implementation of stst.

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

It produces the same output as the Java reference implementation

```
stst -t test include.main test/includeData.json
```

Update: there is now a JavaScript version of stst in the bin folder which simplifies step 2 - you can 
try out compiled templates from the command line with JSON data.

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

* The JavaScript implementation doesn't support the v3 old style group file header
