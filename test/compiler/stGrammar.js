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
            var text = 'd1::=["val1":"foo" ] ';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: null,
                        map: {
                            val1: {
                                type: "STRING",
                                loc: { line: 1, column: 14 },
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

        it("should support single string value with default", function () {
            var text = 'd1::=["val1" : "foo",\ndefault : "bar"]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "STRING",
                            loc: { line: 2, column: 11 },
                            value: "bar"
                        },
                        map: {
                            val1: {
                                type: "STRING",
                                loc: { line: 1, column: 16 },
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

        it("should support just a default", function () {
            var text = 'd1::=[default: "bar"]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "STRING",
                            loc: { line: 1, column: 16 },
                            value: "bar"
                        },
                        map: {
                        },
                        name: "d1"
                    }
                },
                aliases: {},
                imports: []
            };
            assert.deepEqual(parseGroup(text), result);
        });

        it("should support anon template value with anon template default", function () {
            var text = 'd1::=["val1":{\nfoo\n<bar>baz\n},\ndefault: {sub template}]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "ANON_TEMPLATE",
                            loc: { line: 5, column: 10 },
                            value: [{
                                type: "TEXT",
                                loc: { column: 11, line: 5 },
                                value: "sub template"
                            }]
                        },
                        map: {
                            val1: {
                                loc: { line: 1, column: 14 },
                                type: "ANON_TEMPLATE",
                                value: [{
                                    type: "NEWLINE",
                                    loc: {line: 1, column: 15},
                                    value: "\n"
                                }, {
                                    type: "TEXT",
                                    loc: {line: 2, column: 1},
                                    value: "foo"
                                }, {
                                    type: "NEWLINE",
                                    loc: {line: 2, column: 4},
                                    value: "\n"
                                }, {
                                    type: "EXPR",
                                    loc: {line: 3, column: 1},
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: {line: 3, column: 2},
                                        name: "bar"
                                    }
                                }, {
                                    type: "TEXT",
                                    loc: {line: 3, column: 6},
                                    value: "baz"
                                },{
                                    type: "NEWLINE",
                                    loc: {line: 3, column: 9},
                                    value: "\n"
                                }]
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

        it("should support big string value with big string default", function () {
            var text = 'd1::=["val1":<<\nfoo\n<bar>baz\n>>,\ndefault: <<big string>>]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "ANON_TEMPLATE",
                            loc: { line: 5, column: 10 },
                            value: [{
                                type: "TEXT",
                                loc: { column: 1, line: 5 },
                                value: "big string"
                            }]
                        },
                        map: {
                            val1: {
                                loc: { line: 1, column: 14 },
                                type: "ANON_TEMPLATE",
                                value: [{
                                    type: "TEXT",
                                    loc: {line: 2, column: 1},
                                    value: "foo"
                                }, {
                                    type: "NEWLINE",
                                    loc: {line: 2, column: 4},
                                    value: "\n"
                                }, {
                                    type: "EXPR",
                                    loc: {line: 3, column: 1},
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: {line: 3, column: 2},
                                        name: "bar"
                                    }
                                }, {
                                    type: "TEXT",
                                    loc: {line: 3, column: 6},
                                    value: "baz"
                                }]
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

        it("should support big string with no new lines value with big string no new lines default", function () {
            var text = 'd1::=["val1":<%\nfoo\n<bar>baz\n%>,\ndefault: <%big string%>]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "ANON_TEMPLATE",
                            loc: { line: 5, column: 10 },
                            value: [{
                                type: "TEXT",
                                loc: { line: 5, column: 1 },
                                value: "big string"
                            }]
                        },
                        map: {
                            val1: {
                                loc: { line: 1, column: 14 },
                                type: "ANON_TEMPLATE",
                                value: [{
                                    type: "TEXT",
                                    loc: {line: 2, column: 1},
                                    value: "foo"
                                },
                                null,
                                {
                                    type: "EXPR",
                                    loc: {line: 3, column: 1},
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: {line: 3, column: 2},
                                        name: "bar"
                                    }
                                }, {
                                    type: "TEXT",
                                    loc: {line: 3, column: 6},
                                    value: "baz"
                                }]
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

        it("should support boolean values with boolean default", function () {
            var text = 'd1::=["val1": true,\n"val2": false,\ndefault: true]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "BOOLEAN",
                            loc: { line: 3, column: 10 },
                            value: true
                        },
                        map: {
                            val1: {
                                type: "BOOLEAN",
                                loc: { line: 1, column: 15 },
                                value: true
                            },
                            val2: {
                                type: "BOOLEAN",
                                loc: { line: 2, column: 9 },
                                value: false
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

        it("should support empty list", function () {
            var text = 'd1::=["val1": [ ],"val2":[]]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: null,
                        map: {
                            val1: {
                                type: "EMPTY_LIST",
                                loc: { line: 1, column: 15 },
                                value: null
                            },
                            val2: {
                                type: "EMPTY_LIST",
                                loc: { line: 1, column: 26 },
                                value: null
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

        it("should support key keyword value", function () {
            var text = 'd1::=["nosense": key, default: key]';
            var result = {
                templates: {},
                dictionaries: {
                    d1: {
                        default: {
                            type: "DICT_KEY_VALUE",
                            loc: { line: 1, column: 32 },
                            value: null
                        },
                        map: {
                            nosense: {
                                type: "DICT_KEY_VALUE",
                                loc: { line: 1, column: 18 },
                                value: null
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

        it("should give an error if missing colon", function () {
            var text = 'd1::=["val1" "foo"]';

            assert.equal(parseGroup(text).message, "Expected \":\" but \"\\\"\" found." );
        });

        it("should give an error if trailing comma", function () {
            var text = 'd1::=["val1": "foo",]';

            assert.equal(parseGroup(text).message, "Expected \"default\" or string but \"]\" found." );
        });

        it("should give an error if contains nothing", function () {
            var text = 'd1::=[]';

            assert.equal(parseGroup(text).message, "Expected \"default\" or string but \"]\" found." );
        });

        it("should give an error if missing a value", function () {
            var text = 'd1::=["val1": , "val2": true]';

            assert.equal(parseGroup(text).message, 'Expected "false", "key", "true", anonymous template, big string, empty list or string but "," found.' );
        });

        it("should give an error if given an unsuppored value such as a list", function () {
            var text = 'd1::=["val1": ["a", "b", "c"] ]'; 

            assert.equal(parseGroup(text).message, 'Expected "false", "key", "true", anonymous template, big string, empty list or string but "[" found.' );
        });

        it("should give an error if missing closing square bracket", function () {
            var text = 'd1::=["val1": true';

            assert.equal(parseGroup(text).message, 'Expected "," or "]" but end of input found.' );
        });

    });

    // xxx many more tests needed
});
