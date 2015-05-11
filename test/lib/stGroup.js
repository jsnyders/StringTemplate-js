/*global describe, it*/

"use strict";

var assert = require("assert"),
    st = require("../../lib/stRuntime"),
    Dictionary = require("../../lib/Dictionary");

var emptyGroup = function(_, g) {
    return g;
};

describe("stGroup", function() {

    describe("empty group", function() {
        it("should be empty.", function() {
            var g = st.loadGroup(emptyGroup);

            assert.strictEqual(g.imports.length, 0, "no imports");
            assert.deepEqual(g.dictionaries, {}, "no dictionaries");
            assert.deepEqual(g.templates, {}, "no templates");
            assert.strictEqual(g.TEMPLATE_FILE_EXTENSION, ".st");
            assert.strictEqual(g.GROUP_FILE_EXTENSION, ".stg");
        });
    });

    describe("addDictionary", function() {
        it("should have any dictionaries added.", function() {
            var g = st.loadGroup(emptyGroup);

            g.addDictionary("foo", new Dictionary({a:true, b:"value1"}));
            assert.deepEqual(g.dictionaries, {
                foo: {
                    map: {
                        a: true,
                        b: "value1"
                    }
                }
            }, "has dictionary added" );
            g.addDictionary("bar", new Dictionary({a:"A", x:"X"}));
            assert.deepEqual(g.dictionaries, {
                foo: {
                    map: {
                        a: true,
                        b: "value1"
                    }
                },
                bar: {
                    map: {
                        a: "A",
                        x: "X"
                    }
                }
            }, "has dictionary added" );
            // xxx test default, key
        });
        // xxx test overwrite
    });

    describe("addImport", function() {
        it("should have any imports added.", function() {
            var g = st.loadGroup(emptyGroup),
                subGroup = st.loadGroup(emptyGroup),
                subGroup2 = st.loadGroup(emptyGroup);

            g.addImport(subGroup);
            assert.equal(g.imports.length, 1, "has import added");
            assert.equal(g.imports[0], subGroup, "has right import in right order");
            g.addImport(subGroup2);
            assert.equal(g.imports.length, 2, "has import added");
            assert.equal(g.imports[0], subGroup, "has right import in right order");
            assert.equal(g.imports[1], subGroup2, "has right import in right order");
        });
    });

    describe("addTemplate", function() {
        it("should have any templates added.", function() {
            var g = st.loadGroup(emptyGroup),
                t1 = function f1() {},
                t2 = function f2() {};

            g.addTemplate("/a/b/t1", t1);
            assert.strictEqual(g.templates["/a/b/t1"], t1, "has template added");
            g.addTemplate("/t2", t2);
            assert.strictEqual(g.templates["/t2"], t2, "has template added");
        });
        // xxx is it an error to overwrite a template with the same name?
    });

    describe("getTemplate", function() {
        it("should return a template instance.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            g.addTemplate("/t1", t1);
            template = g.getTemplate("t1");
            assert.notStrictEqual(template, null, "found a template");
            assert.strictEqual(template.render, t1, "found the right template");
            assert.strictEqual(template.owningGroup, g, "template has the right group");
            assert.deepEqual(template.scope, {}, "template has the right scope");
        });

        it("should return a template instance from a base group.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                baseGroup = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            baseGroup.addTemplate("/t1", t1);
            g.addImport(baseGroup);
            template = g.getTemplate("t1"); // It is OK to omit the / at the root
            assert.notStrictEqual(template, null, "found a template");
            assert.strictEqual(template.render, t1, "correct template found");
            assert.strictEqual(template.owningGroup, g, "template has the right group");
            assert.deepEqual(template.scope, {}, "template has the right scope");
        });

        it("should return a template instance that overrides one in a base group.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                baseGroup = st.loadGroup(emptyGroup),
                t1 = function f1() {},
                t1a = function f2() {};

            baseGroup.addTemplate("/t1", t1);
            g.addImport(baseGroup);
            g.addTemplate("/t1", t1a);
            template = g.getTemplate("/t1");
            assert.notStrictEqual(template, null, "found a template");
            assert.strictEqual(template.render, t1a, "correct template found");
            assert.strictEqual(template.owningGroup, g, "template has the right group");
            assert.deepEqual(template.scope, {}, "template has the right scope");
        });

        it("should return the right template when there are multiple base groups.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                bg1 = st.loadGroup(emptyGroup),
                bg2 = st.loadGroup(emptyGroup),
                bg21 = st.loadGroup(emptyGroup),
                t1 = function () {},
                t2 = function () {},
                t3 = function () {},
                t1a = function () {},
                t2a = function () {};

            bg1.addTemplate("/t1", t1);
            bg2.addTemplate("/t1", t1a);
            bg2.addTemplate("/t2", t2);
            bg21.addTemplate("/t2", t2a);
            bg21.addTemplate("/t3", t3);

            // (g [(bg1 []), (bg2 [(bg21)]))
            bg2.addImport(bg21);
            g.addImport(bg1);
            g.addImport(bg2);
            template = g.getTemplate("t1");
            assert.strictEqual(template.render, t1, "template found because it is in a group that comes first");
            assert.strictEqual(template.owningGroup, g, "template has the right group");

            template = g.getTemplate("t2");
            assert.strictEqual(template.render, t2, "template found because it overrides base group");
            assert.strictEqual(template.owningGroup, g, "template has the right group");

            template = g.getTemplate("t3");
            assert.strictEqual(template.render, t3, "template found because nothing with same name comes before it or overrides it");
            assert.strictEqual(template.owningGroup, g, "template has the right group");
        });

    });

    describe("getTemplate verify scope", function() {

        it("should return template with correct scope including dictionaries.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            g.addTemplate("/t1", t1);
            g.addDictionary("x", {
                a:"A",
                b:"B"
            });
            g.addDictionary("y", {
                f1:true,
                f2:false
            });
            template = g.getTemplate("t1");
            assert.strictEqual(template.render, t1, "found the right template");
            assert.deepEqual(template.scope, {}, "template has the right scope");
            assert.strictEqual(template.scope.x.a, "A");
            assert.strictEqual(template.scope.x.b, "B");
            assert.strictEqual(template.scope.y.f1, true);
            assert.strictEqual(template.scope.y.f2, false);
        });

        it("should return template with correct scope when there are multiple base groups.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                bg1 = st.loadGroup(emptyGroup),
                bg2 = st.loadGroup(emptyGroup),
                bg21 = st.loadGroup(emptyGroup),
                t1 = function () {},
                t3 = function () {};

            bg1.addTemplate("/t1", t1);
            bg21.addTemplate("/t3", t3);

            // (g [(bg1 []), (bg2 [(bg21)]))
            bg2.addImport(bg21);
            g.addImport(bg1);
            g.addImport(bg2);

            g.addDictionary("a", {level:"g"});
            bg1.addDictionary("a", {level:"bg1"});
            bg1.addDictionary("b", {level:"bg1"});
            bg2.addDictionary("b", {level:"bg2"});
            bg2.addDictionary("c", {level:"bg2"});
            bg21.addDictionary("c", {level:"bg21"});
            bg21.addDictionary("d", {level:"bg21"});

            template = g.getTemplate("t1");
            assert.strictEqual(template.render, t1, "template found because it is in a group that comes first");
            assert.deepEqual(template.scope, {}, "template has the right scope");
            assert.strictEqual(template.scope.a.level, "g");
            assert.strictEqual(template.scope.b.level, "bg1");
            assert.strictEqual(template.scope.c.level, "bg2");
            assert.strictEqual(template.scope.d.level, "bg21");

            template = g.getTemplate("t3");
            assert.strictEqual(template.render, t3, "template found because nothing with same name comes before it or overrides it");
            assert.deepEqual(template.scope, {}, "template has the right scope");
            assert.strictEqual(template.scope.a.level, "g");
            assert.strictEqual(template.scope.b.level, "bg1");
            assert.strictEqual(template.scope.c.level, "bg2");
            assert.strictEqual(template.scope.d.level, "bg21");
        });

    });

    describe("addTemplateAlias", function() {
        it("should have any template aliases added.", function() {
            var g = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            g.addTemplate("/t1", t1);
            g.addTemplateAlias("/t2", "/t1");
            assert.strictEqual(g.templates["/t1"], t1, "has template added");
            assert.strictEqual(g.templates["/t2"], t1, "has template alias added");
        });

        it("should throw an exception if the target doesn't exist.", function() {
            var g = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            g.addTemplate("/t1", t1);
            assert.throws(function() {
                g.addTemplateAlias("/t2", "/t3");
            }, /.*No such template.*t3/, "not found");
        });

        it("should not find the alias target in a base group.", function() {
            var g = st.loadGroup(emptyGroup),
                baseGroup = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            g.addImport(baseGroup);
            baseGroup.addTemplate("/t1", t1);
            assert.strictEqual(g.getTemplate("t1").render, t1, "template found");
            assert.throws(function() {
                g.addTemplateAlias("/t2", "/t1");
            }, /.*No such template.*t1/, "alias target not found");
        });
    });

    describe("getTemplate from alias", function() {
        it("should return a template instance under the alias.", function() {
            var template,
                g = st.loadGroup(emptyGroup),
                t1 = function f1() {};

            g.addTemplate("/t1", t1);
            g.addTemplateAlias("/t2", "/t1");
            template = g.getTemplate("t1");
            assert.strictEqual(template.render, t1, "found the right template under original name");
            template = g.getTemplate("t2");
            assert.strictEqual(template.render, t1, "found the right template under alias");
        });
    });

    describe("attributeRenderer register and get", function() {
        it("should find a function registered", function() {
            var rfn, r,
                g = st.loadGroup(emptyGroup);

            r = function(val, fmt, ctx) {};

            g.registerAttributeRenderer("number", r);
            rfn = g.getAttributeRenderer("number");

            assert.strictEqual(rfn, r, "found the right renderer");
        });

        it("should return null if there is no function registered for a type", function() {
            var rfn, r,
                g = st.loadGroup(emptyGroup);

            r = function(val, fmt, ctx) {};

            g.registerAttributeRenderer("number", r);
            rfn = g.getAttributeRenderer("Foo");

            assert.strictEqual(rfn, null, "no renderer found");
        });
    });
});
