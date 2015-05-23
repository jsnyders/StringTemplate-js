# StringTemplate v4 for JavaScript

Under construction

This will be a pure JavaScript implementation of the StringTemplate v4.
Templates will be compiled to JavaScript

## First Milestone

End to end processing of a simple template.

 * Step 1 Compile. Currently two steps using [stst](https://github.com/jsnyders/STSTv4) to bootstrap

```
node compiler/stc test/include.stg > test/include.stg.ast
stst -t compiler group.compiledGroup test/include.stg.ast > test/include_stg.js
```

This will be a single command once it is complete enough to compile its own code generation template.

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

