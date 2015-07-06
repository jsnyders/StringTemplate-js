/*
 * Template group groupGen
 * Compiled on Sun Jul 05 2015 20:47:29 GMT-0400 (EDT)
 */
var path = require("path");
var base = path.dirname(module.filename);

function getInstance(st, group) {
    "use strict";
var r;
var gFile = "groupGen"; 

group.name = "groupGen";







//
// Template /compiledGroup
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("/*");
    
    
    w.write("\n");
    
    
    w.pushIndentation(" ");
    w.write("* Template group ");
    
    w.popIndentation();
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "fileName", { file: gFile, line: 34, column: 21 }));
    
    
    w.write("\n");
    
    
    w.pushIndentation(" ");
    w.write("* Compiled on ");
    
    w.popIndentation();
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "date", { file: gFile, line: 35, column: 18 }));
    
    
    w.write("\n");
    
    
    w.pushIndentation(" ");
    w.write("*/");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("var path = require(\"path\");");
    
    
    w.write("\n");
    
    
    w.write("var base = path.dirname(module.filename);");
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    w.write("function getInstance(st, group) {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("\"use strict\";");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("var r;");
    
    
    w.write("\n");
    
    
    w.write("var gFile = \"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "fileName", { file: gFile, line: 43, column: 16 }), {format: "string"});
    
    
    w.write("\"; ");
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    w.write("group.name = \"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "fileName", { file: gFile, line: 45, column: 17 }), {format: "string"});
    
    
    w.write("\";");
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("imports", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "imports", { file: gFile, line: 47, column: 11 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("dictionaries", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "dictionaries", { file: gFile, line: 49, column: 16 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("templates", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "templates", { file: gFile, line: 51, column: 13 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("aliases", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "aliases", { file: gFile, line: 53, column: 11 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("return group;");
    
    
    w.write("\n");
    
    
    w.write("}");
    
    
    w.write("\n");
    
    
    w.write("getInstance.base = base;");
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    w.write("module.exports = getInstance;");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "g"     }
];
group.addTemplate("/compiledGroup", r);
 
//
// Template /imports
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = s.im;
    tp.push((function() {
        var t = g.getTemplate("importFile", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    );
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "im"     }
];
group.addTemplate("/imports", r);
 
//
// Template /importFile
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("group.addImport(st.loadImport(base, \"");
    
    
    st.write(w, s, g, rc, s.file, {format: "string"});
    
    
    w.write("\"));");
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "file"     }
];
group.addTemplate("/importFile", r);
 
//
// Template /dictionaries
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = s.d;
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 st.write(w, s, g, rc, (function() {
                 var t = g.getTemplate("dictionary", s);
                 t.setArgs(    [     st.prop(s, g, rc, s.d, s.k, { file: gFile, line: 71, column: 22 })
                      ]    );
                 return t;
                 })()
                 );
                 
                 
        }, [
        { name: "k"     }
        ])); 
    return st.map(attr, tp);
    })()
    , {separator: "\n"});
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "d"     }
];
group.addTemplate("/dictionaries", r);
 
//
// Template /dictionary
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("group.addDictionary(\"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.d, "name", { file: gFile, line: 75, column: 24 }), {format: "string"});
    
    
    w.write("\", new st.Dictionary({");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.d, "map", { file: gFile, line: 76, column: 7 });
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 st.write(w, s, g, rc, (function() {
                 var t = g.getTemplate("props", s);
                 t.setArgs(    [     s.k,
                 st.prop(s, g, rc, st.prop(s, g, rc, s.d, "map", { file: gFile, line: 76, column: 30 }), s.k, { file: gFile, line: 76, column: 34 })
                      ]    );
                 return t;
                 })()
                 );
                 
                 
        }, [
        { name: "k"     }
        ])); 
    return st.map(attr, tp);
    })()
    , {separator: ",\n"});
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("}");
    
    
    if (st.test(st.prop(s, g, rc, s.d, "default", { file: gFile, line: 77, column: 7 }))) {
    
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("value");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.d, "default", { file: gFile, line: 77, column: 29 }), "type", { file: gFile, line: 77, column: 37 }));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     st.prop(s, g, rc, st.prop(s, g, rc, s.d, "default", { file: gFile, line: 77, column: 47 }), "value", { file: gFile, line: 77, column: 55 })
             ]    );
        return t;
        })()
        );
        
        
    
    
    }
    
    
    w.write("));");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "d"     }
];
group.addTemplate("/dictionary", r);
 
//
// Template /props
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, s.k, {format: "key"});
    
    w.popIndentation();
    
    
    w.write(": ");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("value");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.v, "type", { file: gFile, line: 81, column: 33 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.v, "value", { file: gFile, line: 81, column: 43 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "k"     },
{ name: "v"     }
];
group.addTemplate("/props", r);
 
//
// Template /templates
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = s.t;
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 st.write(w, s, g, rc, (function() {
                 var t = g.getTemplate("templateDef", s);
                 t.setArgs(    [     s.k,
                 st.prop(s, g, rc, s.t, s.k, { file: gFile, line: 85, column: 29 })
                      ]    );
                 return t;
                 })()
                 );
                 
                 
                 w.write(" ");
                 
                 
        }, [
        { name: "k"     }
        ])); 
    return st.map(attr, tp);
    })()
    , {separator: "\n"});
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "t"     }
];
group.addTemplate("/templates", r);
 
//
// Template /templateDef
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("//");
    
    
    w.write("\n");
    
    
    w.write("// Template ");
    
    
    st.write(w, s, g, rc, s.name);
    
    
    w.write("\n");
    
    
    w.write("//");
    
    
    w.write("\n");
    
    
    w.write("r = function(w, rc) {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("var g = this.owningGroup,");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("        ");
    w.write("s = this.scope;");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.fn.strip(st.prop(s, g, rc, s.t, "template", { file: gFile, line: 95, column: 13 }));
    tp.push((function() {
        var t = g.getTemplate("templateElement", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    );
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("};");
    
    
    w.write("\n");
    
    
    w.write("r.args = [");
    
    
    w.write("\n");
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.g, "raw", { file: gFile, line: 98, column: 10 }))) {
    
        w.write("    {name:\"it\"}");
        
        
        w.write("\n");
        
        
    
    
    } else {
    
        w.write("    ");
        
        
        st.write(w, s, g, rc, (function() {
        var tp = [],
        attr = st.prop(s, g, rc, s.t, "args", { file: gFile, line: 101, column: 7 });
        tp.push((function() {
            var t = g.getTemplate("formalArgs", s);
            t.setArgs(    [     ""
                 ]    );
            return t;
            })()
            ); 
        return st.map(attr, tp);
        })()
        , {separator: ",\n"});
        
        
        w.write("\n");
        
        
    
    }
    
    
    w.write("];");
    
    
    w.write("\n");
    
    
    w.write("group.addTemplate(\"");
    
    
    st.write(w, s, g, rc, s.name, {format: "string"});
    
    
    w.write("\", r);");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "name"     },
{ name: "t"     }
];
group.addTemplate("/templateDef", r);
 
//
// Template /formalArgs
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("{ name: \"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.arg, "name", { file: gFile, line: 108, column: 18 }), {format: "string"});
    
    
    w.write("\"    ");
    
    
    if (st.test(st.prop(s, g, rc, s.arg, "defaultValue", { file: gFile, line: 109, column: 12 }))) {
    
        w.write("    , default: ");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("expr");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.arg, "defaultValue", { file: gFile, line: 110, column: 27 }), "type", { file: gFile, line: 110, column: 40 }));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     st.prop(s, g, rc, s.arg, "defaultValue", { file: gFile, line: 110, column: 52 })
             ]    );
        return t;
        })()
        );
        
        
        w.write("    ");
        
        
    
    
    }
    
    
    w.write(" }");
    
    
};
r.args = [
        { name: "arg"     }
];
group.addTemplate("/formalArgs", r);
 
//
// Template /templateElement
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    if (st.test(s.e)) {
    
        w.write("\n");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("template");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, s.e, "type", { file: gFile, line: 116, column: 14 }));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     s.e
             ]    );
        return t;
        })()
        );
        
        
    
    
    }
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "e"     }
];
group.addTemplate("/templateElement", r);
 
//
// Template /templateTEXT
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("w.write(\"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.e, "value", { file: gFile, line: 120, column: 12 }), {format: "string"});
    
    
    w.write("\");");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "e"     }
];
group.addTemplate("/templateTEXT", r);
 
//
// Template /templateEXPR
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.write(w, s, g, rc, ");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.e, "expr", { file: gFile, line: 124, column: 32 }), "type", { file: gFile, line: 124, column: 37 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.e, "expr", { file: gFile, line: 124, column: 47 })
         ]    );
    return t;
    })()
    );
    
    
    if (st.test(st.prop(s, g, rc, s.e, "options", { file: gFile, line: 124, column: 59 }))) {
    
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("exprOptions", s);
        t.setArgs(    [     st.prop(s, g, rc, s.e, "options", { file: gFile, line: 124, column: 85 })
             ]    );
        return t;
        })()
        );
        
        
    
    
    }
    
    
    w.write(");");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "e"     }
];
group.addTemplate("/templateEXPR", r);
 
//
// Template /templateINDENTED_EXPR
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("w.pushIndentation(\"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.e, "indent", { file: gFile, line: 128, column: 22 }), {format: "string"});
    
    
    w.write("\");");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("template");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.e, "value", { file: gFile, line: 129, column: 14 }), "type", { file: gFile, line: 129, column: 20 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.e, "value", { file: gFile, line: 129, column: 30 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("w.popIndentation();");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "e"     }
];
group.addTemplate("/templateINDENTED_EXPR", r);
 
//
// Template /templateNEWLINE
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("w.write(\"\\n\");");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "e"     }
];
group.addTemplate("/templateNEWLINE", r);
 
//
// Template /templateIF
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("if (st.test(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.e, "condition", { file: gFile, line: 138, column: 22 }), "type", { file: gFile, line: 138, column: 32 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.e, "condition", { file: gFile, line: 138, column: 42 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(")) {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.e, "template", { file: gFile, line: 139, column: 7 });
    tp.push((function() {
        var t = g.getTemplate("templateElement", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    );
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    if (st.test(st.prop(s, g, rc, s.e, "elseifPart", { file: gFile, line: 140, column: 6 }))) {
    
        w.write("\n");
        
        
        st.write(w, s, g, rc, (function() {
        var tp = [],
        attr = st.prop(s, g, rc, s.e, "elseifPart", { file: gFile, line: 141, column: 3 });
        tp.push((function() {
            var t = g.getTemplate("elseifPart", s);
            t.setArgs(    [     ""
                 ]    );
            return t;
            })()
            ); 
        return st.map(attr, tp);
        })()
        , {separator: "\n"});
        
        
        w.write("\n");
        
        
    
    
    }
    
    
    w.write("\n");
    
    
    if (st.test(st.prop(s, g, rc, s.e, "elsePart", { file: gFile, line: 143, column: 6 }))) {
    
        w.write("\n");
        
        
        w.write("} else {");
        
        
        w.write("\n");
        
        
        w.pushIndentation("    ");
        st.write(w, s, g, rc, (function() {
        var tp = [],
        attr = st.prop(s, g, rc, st.prop(s, g, rc, s.e, "elsePart", { file: gFile, line: 145, column: 7 }), "template", { file: gFile, line: 145, column: 16 });
        tp.push((function() {
            var t = g.getTemplate("templateElement", s);
            t.setArgs(    [     ""
                 ]    );
            return t;
            })()
            ); 
        return st.map(attr, tp);
        })()
        );
        
        w.popIndentation();
        
        
        w.write("\n");
        
        
    
    
    }
    
    
    w.write("\n");
    
    
    w.write("}");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "e"     }
];
group.addTemplate("/templateIF", r);
 
//
// Template /elseifPart
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("} else if(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.eib, "condition", { file: gFile, line: 151, column: 22 }), "type", { file: gFile, line: 151, column: 32 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.eib, "condition", { file: gFile, line: 151, column: 44 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(") {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.eib, "template", { file: gFile, line: 152, column: 9 });
    tp.push((function() {
        var t = g.getTemplate("templateElement", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    );
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "eib"     }
];
group.addTemplate("/elseifPart", r);
 
//
// Template /exprOR
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.test(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "left", { file: gFile, line: 156, column: 18 }), "type", { file: gFile, line: 156, column: 23 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "left", { file: gFile, line: 156, column: 33 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(") || st.test(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "right", { file: gFile, line: 156, column: 62 }), "type", { file: gFile, line: 156, column: 68 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "right", { file: gFile, line: 156, column: 78 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(")");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprOR", r);
 
//
// Template /exprAND
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.test(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "left", { file: gFile, line: 160, column: 18 }), "type", { file: gFile, line: 160, column: 23 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "left", { file: gFile, line: 160, column: 33 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(") && st.test(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "right", { file: gFile, line: 160, column: 62 }), "type", { file: gFile, line: 160, column: 68 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "right", { file: gFile, line: 160, column: 78 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(")");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprAND", r);
 
//
// Template /exprNOT
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("! st.test(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "value", { file: gFile, line: 164, column: 20 }), "type", { file: gFile, line: 164, column: 26 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "value", { file: gFile, line: 164, column: 36 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(")");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprNOT", r);
 
//
// Template /exprFUNCTION
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.fn.");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "name", { file: gFile, line: 168, column: 9 }));
    
    
    w.write("(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "arg", { file: gFile, line: 168, column: 25 }), "type", { file: gFile, line: 168, column: 29 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "arg", { file: gFile, line: 168, column: 39 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(")");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprFUNCTION", r);
 
//
// Template /exprATTRIBUTE
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("s.");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "name", { file: gFile, line: 172, column: 5 }));
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprATTRIBUTE", r);
 
//
// Template /exprMEMBER_EXPR
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("memberRef", s);
    t.setArgs(    [     (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "object", { file: gFile, line: 179, column: 20 }), "type", { file: gFile, line: 179, column: 27 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "object", { file: gFile, line: 179, column: 37 })
         ]    );
    return t;
    })()
    ,
    st.prop(s, g, rc, s.a, "properties", { file: gFile, line: 179, column: 48 })
         ]    );
    return t;
    })()
    );
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprMEMBER_EXPR", r);
 
//
// Template /memberRef
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    if (st.test(st.fn.trunc(s.p))) {
    
        w.write("st.prop(s, g, rc, ");
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("memberRef", s);
        t.setArgs(    [     s.o,
        st.fn.trunc(s.p)
             ]    );
        return t;
        })()
        );
        
        
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("property", s);
        t.setArgs(    [     st.fn.last(s.p)
             ]    );
        return t;
        })()
        );
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("location", s);
        t.setArgs(    [     st.prop(s, g, rc, st.fn.last(s.p), "loc", { file: gFile, line: 184, column: 81 })
             ]    );
        return t;
        })()
        );
        
        
        w.write(")");
        
        
    
    
    } else {
    
        w.write("st.prop(s, g, rc, ");
        
        
        st.write(w, s, g, rc, s.o);
        
        
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("property", s);
        t.setArgs(    [     st.fn.first(s.p)
             ]    );
        return t;
        })()
        );
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("location", s);
        t.setArgs(    [     st.prop(s, g, rc, st.fn.last(s.p), "loc", { file: gFile, line: 186, column: 61 })
             ]    );
        return t;
        })()
        );
        
        
        w.write(")");
        
        
    
    }
    
    
};
r.args = [
        { name: "o"     },
{ name: "p"     }
];
group.addTemplate("/memberRef", r);
 
//
// Template /property
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("property");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.p, "type", { file: gFile, line: 191, column: 14 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.p, "property", { file: gFile, line: 191, column: 24 })
         ]    );
    return t;
    })()
    );
    
    
};
r.args = [
        { name: "p"     }
];
group.addTemplate("/property", r);
 
//
// Template /propertyPROP
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("\"");
    
    
    st.write(w, s, g, rc, s.p, {format: "string"});
    
    
    w.write("\"");
    
    
};
r.args = [
        { name: "p"     }
];
group.addTemplate("/propertyPROP", r);
 
//
// Template /propertyPROP_IND
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.p, "type", { file: gFile, line: 196, column: 10 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     s.p
         ]    );
    return t;
    })()
    );
    
    
};
r.args = [
        { name: "p"     }
];
group.addTemplate("/propertyPROP_IND", r);
 
//
// Template /exprINCLUDE
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("(function() {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("var t = g.getTemplate(\"");
    
    w.popIndentation();
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "templateName", { file: gFile, line: 204, column: 30 }), {format: "string"});
    
    
    w.write("\", s);");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("t.setArgs(    ");
    
    w.popIndentation();
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed", { file: gFile, line: 206, column: 10 }))) {
    
        w.write("{ ");
        
        
    
    
    } else {
    
        w.write("[ ");
        
        
    
    }
    
    
    w.write("    ");
    
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.a, "args", { file: gFile, line: 207, column: 7 });
    tp.push((function() {
        var t = g.getTemplate("includeArgs", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    , {separator: ",\n"});
    
    
    w.write("\n");
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed", { file: gFile, line: 208, column: 10 }))) {
    
        w.write(" }");
        
        
    
    
    } else {
    
        w.write(" ]");
        
        
    
    }
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsPassThrough", { file: gFile, line: 209, column: 10 }))) {
    
        w.write(", true");
        
        
    
    
    }
    
    
    w.write(");");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("return t;");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("})()");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprINCLUDE", r);
 
//
// Template /exprINCLUDE_IND
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("(function() {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("var name = st.toString(s, g, rc, ");
    
    w.popIndentation();
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "expr", { file: gFile, line: 220, column: 47 }), "type", { file: gFile, line: 220, column: 52 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "expr", { file: gFile, line: 220, column: 62 })
         ]    );
    return t;
    })()
    );
    
    
    w.write("),");
    
    
    w.write("\n");
    
    
    w.pushIndentation("        ");
    w.write("t = g.getTemplate(name, s);");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("t.setArgs(    ");
    
    w.popIndentation();
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed", { file: gFile, line: 223, column: 10 }))) {
    
        w.write("{ ");
        
        
    
    
    } else {
    
        w.write("[ ");
        
        
    
    }
    
    
    w.write("    ");
    
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.a, "args", { file: gFile, line: 224, column: 7 });
    tp.push((function() {
        var t = g.getTemplate("includeArgs", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    , {separator: ",\n"});
    
    
    w.write("\n");
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed", { file: gFile, line: 225, column: 10 }))) {
    
        w.write(" }");
        
        
    
    
    } else {
    
        w.write(" ]");
        
        
    
    }
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsPassThrough", { file: gFile, line: 226, column: 10 }))) {
    
        w.write(", true");
        
        
    
    
    }
    
    
    w.write(");");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("return t;");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("})()");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprINCLUDE_IND", r);
 
//
// Template /includeArgs
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    if (st.test(st.prop(s, g, rc, s.a, "argName", { file: gFile, line: 232, column: 6 }))) {
    
        w.write("\"");
        
        
        st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "argName", { file: gFile, line: 233, column: 4 }), {format: "string"});
        
        
        w.write("\": ");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("expr");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "type", { file: gFile, line: 233, column: 41 }));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     s.a
             ]    );
        return t;
        })()
        );
        
        
    
    
    } else {
    
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("expr");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "type", { file: gFile, line: 235, column: 10 }));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     s.a
             ]    );
        return t;
        })()
        );
        
        
    
    }
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/includeArgs", r);
 
//
// Template /exprMAP
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("(function() {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("var tp = [],");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("        ");
    w.write("attr = ");
    
    w.popIndentation();
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "expr", { file: gFile, line: 243, column: 25 }), "type", { file: gFile, line: 243, column: 30 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "expr", { file: gFile, line: 243, column: 40 })
         ]    );
    return t;
    })()
    );
    
    
    w.write(";");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.fn.first(st.prop(s, g, rc, s.a, "using", { file: gFile, line: 244, column: 13 }));
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("tp.push(");
                 
                 
                 st.write(w, s, g, rc, (function() {
                 var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
                 var g = this.owningGroup,
                 s = this.scope;
                 
                          w.write("expr");
                          
                          
                          st.write(w, s, g, rc, st.prop(s, g, rc, s.u, "type", { file: gFile, line: 244, column: 41 }));
                          
                          
                 }, [
                 
                 ])),
                 t = g.getTemplate(name, s);
                 t.setArgs(    [     s.u
                      ]    );
                 return t;
                 })()
                 );
                 
                 
                 w.write(");");
                 
                 
        }, [
        { name: "u"     }
        ])); 
    return st.map(attr, tp);
    })()
    );
    
    w.popIndentation();
    
    
    w.write(" ");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("return st.map(attr, tp);");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.write("})()");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprMAP", r);
 
//
// Template /exprBOOLEAN
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "value", { file: gFile, line: 249, column: 3 }));
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprBOOLEAN", r);
 
//
// Template /exprSTRING
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("\"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "value", { file: gFile, line: 251, column: 4 }), {format: "string"});
    
    
    w.write("\"");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprSTRING", r);
 
//
// Template /exprLIST
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("[ ");
    
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.a, "value", { file: gFile, line: 253, column: 5 });
    tp.push((function() {
        var t = g.getTemplate("listItem", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    , {separator: ", "});
    
    
    w.write(" ]");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprLIST", r);
 
//
// Template /listItem
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.item, "type", { file: gFile, line: 255, column: 13 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     s.item
         ]    );
    return t;
    })()
    );
    
    
};
r.args = [
        { name: "item"     }
];
group.addTemplate("/listItem", r);
 
//
// Template /exprSUBTEMPLATE
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.makeSubTemplate(g, function(w, rc) {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("         ");
    w.write("var g = this.owningGroup,");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("             ");
    w.write("s = this.scope;");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("         ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.fn.strip(st.prop(s, g, rc, s.a, "template", { file: gFile, line: 260, column: 18 }));
    tp.push((function() {
        var t = g.getTemplate("templateElement", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    );
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("     ");
    w.write("}, [");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("        ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.a, "args", { file: gFile, line: 262, column: 11 });
    tp.push((function() {
        var t = g.getTemplate("formalArgs", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    , {separator: ",\n"});
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("     ");
    w.write("])");
    
    w.popIndentation();
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/exprSUBTEMPLATE", r);
 
//
// Template /exprOptions
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("{");
    
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = s.opts;
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 st.write(w, s, g, rc, (function() {
                 var t = g.getTemplate("exprOption", s);
                 t.setArgs(    [     st.prop(s, g, rc, s.o, "name", { file: gFile, line: 268, column: 27 }),
                 st.prop(s, g, rc, s.o, "value", { file: gFile, line: 268, column: 35 })
                      ]    );
                 return t;
                 })()
                 );
                 
                 
        }, [
        { name: "o"     }
        ])); 
    return st.map(attr, tp);
    })()
    , {separator: ",\n"});
    
    
    w.write("}");
    
    
};
r.args = [
        { name: "opts"     }
];
group.addTemplate("/exprOptions", r);
 
//
// Template /exprOption
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, s.k, {format: "key"});
    
    
    w.write(": ");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.v, "type", { file: gFile, line: 273, column: 32 }));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     s.v
         ]    );
    return t;
    })()
    , {format: "string"});
    
    
};
r.args = [
        { name: "k"     },
{ name: "v"     }
];
group.addTemplate("/exprOption", r);
 
//
// Template /valueBOOLEAN
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, s.v);
    
    
};
r.args = [
        { name: "v"     }
];
group.addTemplate("/valueBOOLEAN", r);
 
//
// Template /valueSTRING
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("\"");
    
    
    st.write(w, s, g, rc, s.v, {format: "string"});
    
    
    w.write("\"");
    
    
};
r.args = [
        { name: "v"     }
];
group.addTemplate("/valueSTRING", r);
 
//
// Template /valueANON_TEMPLATE
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.makeAnonTemplate(group, function(w, rc) {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("        ");
    w.write("var g = this.owningGroup,");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("            ");
    w.write("s = this.scope;");
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("        ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.fn.strip(s.v);
    tp.push((function() {
        var t = g.getTemplate("templateElement", s);
        t.setArgs(    [     ""
             ]    );
        return t;
        })()
        ); 
    return st.map(attr, tp);
    })()
    );
    
    w.popIndentation();
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("})");
    
    w.popIndentation();
    
    
};
r.args = [
        { name: "v"     }
];
group.addTemplate("/valueANON_TEMPLATE", r);
 
//
// Template /valueDICT_KEY_VALUE
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("st.Dictionary.DICT_KEY_VALUE");
    
    
};
r.args = [
        { name: "v"     }
];
group.addTemplate("/valueDICT_KEY_VALUE", r);
 
//
// Template /valueEMPTY_LIST
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("[]");
    
    
};
r.args = [
        { name: "v"     }
];
group.addTemplate("/valueEMPTY_LIST", r);
 
//
// Template /aliases
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = s.a;
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 st.write(w, s, g, rc, (function() {
                 var t = g.getTemplate("alias", s);
                 t.setArgs(    [     s.k,
                 st.prop(s, g, rc, s.a, s.k, { file: gFile, line: 291, column: 23 })
                      ]    );
                 return t;
                 })()
                 );
                 
                 
                 w.write(" ");
                 
                 
        }, [
        { name: "k"     }
        ])); 
    return st.map(attr, tp);
    })()
    );
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "a"     }
];
group.addTemplate("/aliases", r);
 
//
// Template /alias
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    w.write("group.addTemplateAlias(\"");
    
    
    st.write(w, s, g, rc, s.a);
    
    
    w.write("\", \"");
    
    
    st.write(w, s, g, rc, s.t);
    
    
    w.write("\");");
    
    
    w.write("\n");
    
    
};
r.args = [
        { name: "a"     },
{ name: "t"     }
];
group.addTemplate("/alias", r);
 
//
// Template /location
//
r = function(w, rc) {
    var g = this.owningGroup,
        s = this.scope;
    
    if (st.test(s.l)) {
    
        w.write(", { file: gFile, line: ");
        
        
        st.write(w, s, g, rc, st.prop(s, g, rc, s.l, "line", { file: gFile, line: 302, column: 26 }));
        
        
        w.write(", column: ");
        
        
        st.write(w, s, g, rc, st.prop(s, g, rc, s.l, "column", { file: gFile, line: 302, column: 44 }));
        
        
        w.write(" }");
        
        
    
    
    }
    
    
};
r.args = [
        { name: "l"     }
];
group.addTemplate("/location", r);
 




return group;
}
getInstance.base = base;

module.exports = getInstance;
