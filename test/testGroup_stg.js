/*
 * Template group testGroup
 * Compiled on Sat May 16 2015 23:18:02 GMT-0400 (EDT)
 */
var path = require("path");
var base = path.dirname(module.filename);

function getInstance(st, group) {
    "use strict";
var r;
group.name = "testGroup";

group.addImport(st.loadImport(base, "include.stg"));


group.addDictionary("dict1", new st.Dictionary({
        template: st.makeAnonTemplate(group, function(w, rc) {
            var g = this.owningGroup,
                s = this.scope;
            w.write("value of big is: ");
            st.write(w, g, rc, st.prop(g, s.dict1, "big"));
        }),
        T: true,
        F: false,
        str: "A",
        "test template": st.makeAnonTemplate(group, function(w, rc) {
            var g = this.owningGroup,
                s = this.scope;
            w.write("What is attr a? ");
            st.write(w, g, rc, s.a);
        }),
        big2: st.makeAnonTemplate(group, function(w, rc) {
            var g = this.owningGroup,
                s = this.scope;
            w.write("\n");
            w.pushIndentation("   ");
            w.write("big");
            w.popIndentation();
            w.write("\n");
            w.pushIndentation("   ");
            w.write("string without new lines");
            w.popIndentation();
            w.write("\n");
            w.write("   ");
        }),
        big: st.makeAnonTemplate(group, function(w, rc) {
            var g = this.owningGroup,
                s = this.scope;
            w.write("big string ");
            w.write("\n");
            w.write("and it is a » template ");
        }),
        key: st.Dictionary.DICT_KEY_VALUE
}));
group.addDictionary("dict3", new st.Dictionary({
        str: "C",
        emptyList: []
}, st.Dictionary.DICT_KEY_VALUE));
group.addDictionary("dict2", new st.Dictionary({
        "default": "value of key default",
        str: "B"
}, "X"));

//
// Template /conditions
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.pushIndentation("    ");
    w.write("With ");
    w.popIndentation();
    st.write(w, g, rc, (function() {
        var tp = [],
            attr = s.tests;
        tp.push(st.makeSubTemplate(group, function(w, rc) {
                 var g = this.owningGroup,
                     s = this.scope;
                 w.write(" ");
                 st.write(w, g, rc, s.k);
                 w.write(" = ");
                 st.write(w, g, rc, st.prop(g, s.tests, "nametype"));
             }, [
                { name: "" }
             ])); 
        return st.map(attr, tp);
    })(), {separator: ", "});
    w.write("\n");
    w.write("    ");
    if (! st.prop(g, s.tests, "c1") || st.prop(g, s.tests, "c2") && ! st.prop(g, s.tests, "c3")) {
        w.write("\n");
        w.pushIndentation("       ");
        w.write("if branch        ");
        w.popIndentation();
        w.write("\n");
    } else if(st.prop(g, s.arg1, "foo")) {
        w.write("\n");
        w.pushIndentation("       ");
        w.write("first else if branch");
        w.popIndentation();
        w.write("\n");
    } else if(st.prop(g, s.arg1, "bar")) {
        w.write("\n");
        w.pushIndentation("        ");
        w.write("second else if branch");
        w.popIndentation();
        w.write("\n");
    } else {
        w.write("\n");
        w.pushIndentation("        ");
        w.write("else branch");
        w.popIndentation();
        w.write("\n");
    }
    w.write("\n");
    w.pushIndentation("    ");
    w.write("after first if");
    w.popIndentation();
    w.write("\n");
    w.write("    ");
    if (! st.prop(g, s.tests, "c1") || st.prop(g, s.tests, "c2") && ! st.prop(g, s.tests, "c3")) {
        w.write("\n");
        w.pushIndentation("        ");
        w.write("second if branch");
        w.popIndentation();
        w.write("\n");
    }
    w.write("\n");
    w.pushIndentation("    ");
    w.write("after second if");
    w.popIndentation();
    w.write("\n");
};
r.args = [
    { name: "tests" }
];
group.addTemplate("/conditions", r); 
//
// Template /testDictionaryAccess
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.write("Test dictionary access:");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "str"));
    w.write(" is A");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "T"));
    w.write(" is true");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "F"));
    w.write(" is false");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "big"));
    w.write(" is big string\\nand it is a » template");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "big2"));
    w.write(" is big string without new lines");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "template"));
    w.write(" is value of big is: big string\\nand it is a » template");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "key"));
    w.write(" is key");
    w.write("\n");
    w.write("no such key: /");
    st.write(w, g, rc, st.prop(g, s.dict1, "nosuch"));
    w.write("/ /");
    st.write(w, g, rc, st.prop(g, s.dict1, "nosuch"), {null: "empty"});
    w.write("/");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict2, "str"));
    w.write(" is B");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict2, "valuetype"));
    w.write(" is X not value of key default ");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict2, "nosuch"));
    w.write(" is X");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict3, "valuetype"));
    w.write(" is C");
    w.write("\n");
    w.write("empty list /");
    st.write(w, g, rc, st.prop(g, s.dict3, "emptyList"));
    w.write("/");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict3, "foobar"));
    w.write(" is foobar");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "valuetype"));
    w.write("\n");
};
r.args = [
    { name: "a" }
];
group.addTemplate("/testDictionaryAccess", r); 
//
// Template /testLiterals
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.write("Test Literals:");
    w.write("\n");
    w.write("This is true: ");
    st.write(w, g, rc, true);
    w.write(".");
    w.write("\n");
    w.write("This is false: ");
    st.write(w, g, rc, false);
    w.write(".");
    w.write("\n");
    w.write("This is a string: ");
    st.write(w, g, rc, "just a string");
    w.write(".");
    w.write("\n");
    w.write("This is an empty list/array: ");
    st.write(w, g, rc, [  ]);
    w.write(".");
    w.write("\n");
    w.write("This is a list of literals: ");
    st.write(w, g, rc, [ true, false, "string", [  ] ]);
    w.write(".");
    w.write("\n");
    w.write("\n");
};
r.args = [
];
group.addTemplate("/testLiterals", r); 
//
// Template /sub
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("[");
    st.write(w, g, rc, s.first);
    w.write("], [");
    st.write(w, g, rc, s.last);
    w.write("]");
};
r.args = [
    { name: "first" },
    { name: "last" }
];
group.addTemplate("/sub", r); 
//
// Template /main
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.write("The { and } should be handled as regular text");
    w.write("\n");
    w.pushIndentation("    ");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("testEscapes", s);
        return t;
    })());
    w.popIndentation();
    w.write("\n");
    w.pushIndentation("    ");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("testLiterals", s);
        return t;
    })());
    w.popIndentation();
    w.write("\n");
    w.pushIndentation("    ");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("testDictionaryAccess", s);
        t.add(0, "foo");

        return t;
    })());
    w.popIndentation();
    w.write("\n");
    w.pushIndentation("    ");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("testDictionaryAccessAlt", s);
        t.add(0, "bar");

        return t;
    })());
    w.popIndentation();
    w.write("\n");
    w.pushIndentation("    ");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("testDictionaryAccessAlt", s);
        t.add(0, "baz");

        return t;
    })());
    w.popIndentation();
    w.write("\n");
    w.pushIndentation("    ");
    st.write(w, g, rc, (function() {
        var tp = [],
            attr = s.names;
        tp.push((function() {
            var t = g.getTemplate("simple", s);
            return t;
        })()); 
        return st.map(attr, tp);
    })(), {separator: "\n"});
    w.popIndentation();
    w.write("\n");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("conditions", s);
        t.add(0, s.conditions);

        return t;
    })());
    w.write("\n");
    w.write("Make sure can call template in imported group: ");
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("sub", s);
        t.add(0, "a");

        t.add(1, "b");

        return t;
    })());
    w.write("\n");
};
r.args = [
    { name: "names" },
    { name: "conditions" }
];
group.addTemplate("/main", r); 
//
// Template /simple
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.write("Greeting: ");
    if (st.prop(g, s.arg1, "hasTitle")) {
        w.write("");
        st.write(w, g, rc, st.prop(g, s.arg1, "title"));
        w.write(" ");
    }
    st.write(w, g, rc, (function() {
        var t = g.getTemplate("sub", s);
        t.add(0, st.prop(g, s.arg1, "first"));

        t.add(1, st.prop(g, s.arg1, "last"));

        return t;
    })());
    w.write("\n");
    w.pushIndentation("    ");
    w.write("Body");
    w.popIndentation();
    w.write("\n");
};
r.args = [
    { name: "arg1" }
];
group.addTemplate("/simple", r); 
//
// Template /testDictionaryAccessAlt
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.write("Test dictionary access with different value of attr a:");
    w.write("\n");
    st.write(w, g, rc, st.prop(g, s.dict1, "valuetype"));
    w.write("\n");
};
r.args = [
    { name: "a" }
];
group.addTemplate("/testDictionaryAccessAlt", r); 
//
// Template /testEscapes
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    w.write("\n");
    w.write("Test Escapes:");
    w.write("\n");
    w.write("Start char $ works");
    w.write("\n");
    w.write("Backslash alone \\ is fine as is \\ and \\$.");
    w.write("\n");
    w.write("Backslash bracket (\\}) is also used for } inside anon templates ");
    st.write(w, g, rc, st.makeSubTemplate(group, function(w, rc) {
             var g = this.owningGroup,
                 s = this.scope;
             w.write(" don't end yet} ok now end");
         }, [
         ]));
    w.write("\n");
    w.pushIndentation("  ");
    w.write("Tab	escape");
    w.popIndentation();
    w.write("\n");
    w.write("Space escape");
    w.write("\n");
    w.write("Newline\nescape");
    w.write("\n");
    w.write("Unicode¼»escape for 1/4 >>");
    w.write("\n");
    w.write("Skip newlineThis should not be at the start of a line");
    w.write("\n");
    w.write("\n");
};
r.args = [
];
group.addTemplate("/testEscapes", r); 

return group;
}
getInstance.base = base;

module.exports = getInstance;
