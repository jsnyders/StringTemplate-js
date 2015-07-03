/*
 * Template group groupGen
 * Compiled on Tue Jun 30 2015 22:23:57 GMT-0400 (EDT)
 */
var path = require("path");
var base = path.dirname(module.filename);

function getInstance(st, group) {
    "use strict";
var r;
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "fileName"));
    
    
    w.write("\n");
    
    
    w.pushIndentation(" ");
    w.write("* Compiled on ");
    
    w.popIndentation();
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "date"));
    
    
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
    
    
    w.write("group.name = \"");
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.g, "fileName"), {format: "string"});
    
    
    w.write("\";");
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("imports", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "imports")
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("dictionaries", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "dictionaries")
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("templates", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "templates")
         ]    );
    return t;
    })()
    );
    
    
    w.write("\n");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var t = g.getTemplate("aliases", s);
    t.setArgs(    [     st.prop(s, g, rc, s.g, "aliases")
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
                 t.setArgs(    [     st.prop(s, g, rc, s.d, s.k)
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.d, "name"), {format: "string"});
    
    
    w.write("\", new st.Dictionary({");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.d, "map");
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 st.write(w, s, g, rc, (function() {
                 var t = g.getTemplate("props", s);
                 t.setArgs(    [     s.k,
                 st.prop(s, g, rc, st.prop(s, g, rc, s.d, "map"), s.k)
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
    
    
    if (st.test(st.prop(s, g, rc, s.d, "default"))) {
    
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("value");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.d, "default"), "type"));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     st.prop(s, g, rc, st.prop(s, g, rc, s.d, "default"), "value")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.v, "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.v, "value")
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
                 st.prop(s, g, rc, s.t, s.k)
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
    attr = st.fn.strip(st.prop(s, g, rc, s.t, "template"));
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
    
    
    if (st.test(st.prop(s, g, rc, s.g, "raw"))) {
    
        w.write("    {name:\"it\"}");
        
        
        w.write("\n");
        
        
    
    
    } else {
    
        w.write("    ");
        
        
        st.write(w, s, g, rc, (function() {
        var tp = [],
        attr = st.prop(s, g, rc, s.t, "args");
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.arg, "name"), {format: "string"});
    
    
    w.write("\"    ");
    
    
    if (st.test(st.prop(s, g, rc, s.arg, "defaultValue"))) {
    
        w.write("    , default: ");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("expr");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.arg, "defaultValue"), "type"));
                 
                 
        }, [
        
        ])),
        t = g.getTemplate(name, s);
        t.setArgs(    [     st.prop(s, g, rc, s.arg, "defaultValue")
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
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, s.e, "type"));
                 
                 
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.e, "value"), {format: "string"});
    
    
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.e, "expr"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.e, "expr")
         ]    );
    return t;
    })()
    );
    
    
    if (st.test(st.prop(s, g, rc, s.e, "options"))) {
    
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("exprOptions", s);
        t.setArgs(    [     st.prop(s, g, rc, s.e, "options")
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.e, "indent"), {format: "string"});
    
    
    w.write("\");");
    
    
    w.write("\n");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("template");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.e, "value"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.e, "value")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.e, "condition"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.e, "condition")
         ]    );
    return t;
    })()
    );
    
    
    w.write(")) {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.e, "template");
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
    
    
    if (st.test(st.prop(s, g, rc, s.e, "elseifPart"))) {
    
        w.write("\n");
        
        
        st.write(w, s, g, rc, (function() {
        var tp = [],
        attr = st.prop(s, g, rc, s.e, "elseifPart");
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
    
    
    if (st.test(st.prop(s, g, rc, s.e, "elsePart"))) {
    
        w.write("\n");
        
        
        w.write("} else {");
        
        
        w.write("\n");
        
        
        w.pushIndentation("    ");
        st.write(w, s, g, rc, (function() {
        var tp = [],
        attr = st.prop(s, g, rc, st.prop(s, g, rc, s.e, "elsePart"), "template");
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.eib, "condition"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.eib, "condition")
         ]    );
    return t;
    })()
    );
    
    
    w.write(") {");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.eib, "template");
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "left"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "left")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "right"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "right")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "left"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "left")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "right"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "right")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "value"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "value")
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "name"));
    
    
    w.write("(");
    
    
    st.write(w, s, g, rc, (function() {
    var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
    var g = this.owningGroup,
    s = this.scope;
    
             w.write("expr");
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "arg"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "arg")
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "name"));
    
    
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "object"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "object")
         ]    );
    return t;
    })()
    ,
    st.prop(s, g, rc, s.a, "properties")
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
        
        
        w.write(")");
        
        
    
    
    } else {
    
        w.write("st.prop(s, g, rc, ");
        
        
        st.write(w, s, g, rc, s.o);
        
        
        w.write(", ");
        
        
        st.write(w, s, g, rc, (function() {
        var t = g.getTemplate("property", s);
        t.setArgs(    [     st.fn.first(st.prop(s, g, rc, s.a, "properties"))
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.p, "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.p, "property")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.p, "type"));
             
             
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "templateName"), {format: "string"});
    
    
    w.write("\", s);");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    w.write("t.setArgs(    ");
    
    w.popIndentation();
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed"))) {
    
        w.write("{ ");
        
        
    
    
    } else {
    
        w.write("[ ");
        
        
    
    }
    
    
    w.write("    ");
    
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.a, "args");
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
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed"))) {
    
        w.write(" }");
        
        
    
    
    } else {
    
        w.write(" ]");
        
        
    
    }
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsPassThrough"))) {
    
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "expr"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "expr")
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
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed"))) {
    
        w.write("{ ");
        
        
    
    
    } else {
    
        w.write("[ ");
        
        
    
    }
    
    
    w.write("    ");
    
    
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.prop(s, g, rc, s.a, "args");
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
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsNamed"))) {
    
        w.write(" }");
        
        
    
    
    } else {
    
        w.write(" ]");
        
        
    
    }
    
    
    w.write("    ");
    
    
    if (st.test(st.prop(s, g, rc, s.a, "argsPassThrough"))) {
    
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
    
    if (st.test(st.prop(s, g, rc, s.a, "argName"))) {
    
        w.write("\"");
        
        
        st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "argName"), {format: "string"});
        
        
        w.write("\": ");
        
        
        st.write(w, s, g, rc, (function() {
        var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("expr");
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "type"));
                 
                 
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
                 
                 
                 st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "type"));
                 
                 
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, st.prop(s, g, rc, s.a, "expr"), "type"));
             
             
    }, [
    
    ])),
    t = g.getTemplate(name, s);
    t.setArgs(    [     st.prop(s, g, rc, s.a, "expr")
         ]    );
    return t;
    })()
    );
    
    
    w.write(";");
    
    
    w.write("\n");
    
    
    w.pushIndentation("    ");
    st.write(w, s, g, rc, (function() {
    var tp = [],
    attr = st.fn.first(st.prop(s, g, rc, s.a, "using"));
    tp.push(st.makeSubTemplate(g, function(w, rc) {
        var g = this.owningGroup,
        s = this.scope;
        
                 w.write("tp.push(");
                 
                 
                 st.write(w, s, g, rc, (function() {
                 var name = st.toString(s, g, rc, st.makeSubTemplate(g, function(w, rc) {
                 var g = this.owningGroup,
                 s = this.scope;
                 
                          w.write("expr");
                          
                          
                          st.write(w, s, g, rc, st.prop(s, g, rc, s.u, "type"));
                          
                          
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
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "value"));
    
    
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
    
    
    st.write(w, s, g, rc, st.prop(s, g, rc, s.a, "value"), {format: "string"});
    
    
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
    attr = st.prop(s, g, rc, s.a, "value");
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.item, "type"));
             
             
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
    attr = st.fn.strip(st.prop(s, g, rc, s.a, "template"));
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
    attr = st.prop(s, g, rc, s.a, "args");
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
                 t.setArgs(    [     st.prop(s, g, rc, s.o, "name"),
                 st.prop(s, g, rc, s.o, "value")
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
             
             
             st.write(w, s, g, rc, st.prop(s, g, rc, s.v, "type"));
             
             
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
                 st.prop(s, g, rc, s.a, s.k)
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
 




return group;
}
getInstance.base = base;

module.exports = getInstance;
