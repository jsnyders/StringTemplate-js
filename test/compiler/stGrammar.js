/*global describe, it*/

"use strict";

var assert = require("assert"),
    g = require("../../compiler/stGrammar"),
    makeGroup = require("../../compiler/group.js").makeGroup;

function parseGroup(text, start, stop) {
    var group,
        options = {
        startRule: "groupFile",
        group: makeGroup("", "testfile"),
        verbose: false,
        delimiterStartChar: start || "<",
        delimiterStopChar: stop || ">"
    };
    try {
        g.parse(text, options);
        group = options.group;
        delete group.groupFolder;
        delete group.fileName;
        delete group.raw;
        return options.group;
    } catch (ex) {
        return ex;
    }
}

describe("stGrammar", function() {

    describe("empty group", function() {
        it("should be OK but have no templates etc.", function() {
            var text = '';
            var result = {
                templates:{},
                dictionaries: {},
                aliases: {},
                imports: []
            };
            assert.deepEqual(parseGroup(text), result );
            text = '\n/* comment */\n// comment\n';
            assert.deepEqual(parseGroup(text), result );
        });

    });

    describe("imports and delimiters", function() {
        it("should allow just delimiters", function() {
            var text = 'delimiters "$","$"';
            var result = {
                templates:{},
                dictionaries: {},
                aliases: {},
                imports: []
            };
            assert.deepEqual(parseGroup(text), result );
            text = '\n/* comment */\n  delimiters "$" , "$" // comment\n';
            assert.deepEqual(parseGroup(text), result );
        });

        it("should give error if bad delimiters", function() {
            var text = 'delimiters "<$","$>"';

            assert.equal(parseGroup(text).message, "Delimiter value must be exactly one character" );
            text = 'delimiters "$" ';
            assert.equal(parseGroup(text).message, "Expected \",\" but end of input found." );
            text = 'delimiters "@", "@" ';
            assert.equal(parseGroup(text).message, "Invalid delimiter character" );
        });

        it("should allow just imports", function() {
            var text = 'import "foo/bar.stg" import "foo/baz.stg"';
            var result = {
                templates:{},
                dictionaries: {},
                aliases: {},
                imports: ["foo/bar.stg","foo/baz.stg"]
            };
            assert.deepEqual(parseGroup(text), result );
            text = '\n/* comment */\nimport "foobar.stg" // comment\n';
            result = {
                templates:{},
                dictionaries: {},
                aliases: {},
                imports: ["foobar.stg"]
            };
            assert.deepEqual(parseGroup(text), result );
        });

        it("should give error if delimiters come after imports", function() {
            var text = 'import "foo.stg"\ndelimiters "<$","$>"';

            assert.equal(parseGroup(text).message, "Expected \"@\", \"import\", end of file or identifier but \"d\" found." );
        });

    });

    describe("dictionaries", function() {
        it("should support single string value with no default", function () {
            var text = 'd1::=["val1":"foo"]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: null,
                        map: {
                            val1: {
                                type: "STRING",
                                value: "foo"
                            }
                        },
                        name: "d1"
                    }
                },
                aliases: {},
                imports: []
            };
            assert.deepEqual(parseGroup(text), result);
        });
    });

});
