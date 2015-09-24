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

            assert.equal(parseGroup(text).message, "Delimiter value must be exactly one character." );
            text = 'delimiters "$" ';
            assert.equal(parseGroup(text).message, "Expected \",\" but end of input found." );
            text = 'delimiters "@", "@" ';
            assert.equal(parseGroup(text).message, "Invalid delimiter character." );
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

    describe("templates", function() {
        it("should recognize a template defined with a string", function () {
            var text = 't1() ::= "a template <attr>."',
                result = {
                    templates: {
                        "/t1": {
                            name: "t1",
                            args: [],
                            template: [
                                {
                                    type: "TEXT",
                                    loc: { line: 1, column: 1 },
                                    value: "a template " 
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 1, column: 12 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 1, column: 13 },
                                        name: "attr"
                                    } 
                                },
                                {
                                    type: "TEXT",
                                    loc: { line: 1, column: 18 },
                                    value: "."
                                }
                            ]
                        }
                    },
                    dictionaries: {},
                    aliases: {},
                    imports: []
                };

            assert.deepEqual(parseGroup(text), result);
        });

        it("should recognize a template defined with a big string", function () {
            var text = 't1() ::= <<\na template\n<attr>.\n>>', // note leading and trailing new lines are stripped
                result = {
                    templates: {
                        "/t1": {
                            name: "t1",
                            args: [],
                            template: [
                                {
                                    type: "TEXT",
                                    loc: { line: 2, column: 1 },
                                    value: "a template"
                                },
                                {
                                    type: "NEWLINE",
                                    loc: { line: 2, column: 11 },
                                    value: "\n"
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 3, column: 1 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 3, column: 2 },
                                        name: "attr"
                                    }
                                },
                                {
                                    type: "TEXT",
                                    loc: { line: 3, column: 7 },
                                    value: "."
                                }
                            ]
                        }
                    },
                    dictionaries: {},
                    aliases: {},
                    imports: []
                };

            assert.deepEqual(parseGroup(text), result);
        });

        it("should recognize a template defined with a big string ignoring new lines", function () {
            var text = 't1() ::= <%\na template\n<attr>.\n%>', // note all new lines are stripped
                result = {
                    templates: {
                        "/t1": {
                            name: "t1",
                            args: [],
                            template: [
                                {
                                    type: "TEXT",
                                    loc: { line: 2, column: 1 },
                                    value: "a template"
                                },
                                null,
                                {
                                    type: "EXPR",
                                    loc: { line: 3, column: 1 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 3, column: 2 },
                                        name: "attr"
                                    }
                                },
                                {
                                    type: "TEXT",
                                    loc: { line: 3, column: 7 },
                                    value: "."
                                }
                            ]
                        }
                    },
                    dictionaries: {},
                    aliases: {},
                    imports: []
                };

            assert.deepEqual(parseGroup(text), result);
        });

        it("should recognize a template with one argument", function () {
            var text = 't1(a)::=<<\na<a>\n>>',
                result = {
                    templates: {
                        "/t1": {
                            name: "t1",
                            args: [ {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 4 },
                                name: "a"
                            } ],
                            template: [
                                {
                                    type: "TEXT",
                                    loc: { line: 2, column: 1 },
                                    value: "a"
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 2 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 3 },
                                        name: "a"
                                    }
                                }
                            ]
                        }
                    },
                    dictionaries: {},
                    aliases: {},
                    imports: []
                };

            assert.deepEqual(parseGroup(text), result);
        });

        it("should recognize a template with multiple arguments", function () {
            var text = 't1 ( a , b ) ::= <<\na<a> b<b>\n>>',
                result = {
                    templates: {
                        "/t1": {
                            name: "t1",
                            args: [ {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 6 },
                                name: "a"
                            }, {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 10 },
                                name: "b"
                            } ],
                            template: [
                                {
                                    type: "TEXT",
                                    loc: { line: 2, column: 1 },
                                    value: "a"
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 2 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 3 },
                                        name: "a"
                                    }
                                },
                                {
                                    type: "TEXT",
                                    loc: { line: 2, column: 5 },
                                    value: " b"
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 7 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 8 },
                                        name: "b"
                                    }
                                }
                            ]
                        }
                    },
                    dictionaries: {},
                    aliases: {},
                    imports: []
                };

            assert.deepEqual(parseGroup(text), result);
        });

        it("should recognize a template with multiple arguments with default values of each type", function () {
            var text = 't1 ( a , b="one", c=true, d=false, e=[],f={sub} ) ::= <<\n<a><b><c><d><e><f>\n>>',
                result = {
                    templates: {
                        "/t1": {
                            name: "t1",
                            args: [ {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 6 },
                                name: "a"
                            }, {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 10 }, 
                                name: "b",
                                defaultValue: {
                                    type: "STRING",
                                    loc: { line: 1, column: 12 },
                                    value: "one"
                                }
                            }, {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 19 },
                                name: "c",
                                defaultValue: {
                                    type: "BOOLEAN",
                                    loc: { line: 1, column: 21 },
                                    value: true
                                }
                            }, {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 27 },
                                name: "d",
                                defaultValue: {
                                    type: "BOOLEAN",
                                    loc: { line: 1, column: 29 },
                                    value: false
                                }
                            }, {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 36 },
                                name: "e",
                                defaultValue: {
                                    type: "EMPTY_LIST",
                                    loc: { line: 1, column: 38 },
                                    value: null
                                }
                            }, {
                                type: "FORMAL_ARG",
                                loc: { line: 1, column: 41 },
                                name: "f",
                                defaultValue: {
                                    type: "ANON_TEMPLATE",
                                    loc: { line: 1, column: 43 },
                                    value: [
                                        {
                                            type: "TEXT",
                                            loc: { line: 1, column: 44 },
                                            value: "sub"
                                        }
                                    ]
                                }
                            } ],
                            template: [
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 1 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 2 },
                                        name: "a"
                                    }
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 4 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 5 },
                                        name: "b"
                                    }
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 7 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 8 },
                                        name: "c"
                                    }
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 10 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 11 },
                                        name: "d"
                                    }
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 13 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 14 },
                                        name: "e"
                                    }
                                },
                                {
                                    type: "EXPR",
                                    loc: { line: 2, column: 16 },
                                    expr: {
                                        type: "ATTRIBUTE",
                                        loc: { line: 2, column: 17 },
                                        name: "f"
                                    }
                                }
                            ]
                        }
                    },
                    dictionaries: {},
                    aliases: {},
                    imports: []
                };

            assert.deepEqual(parseGroup(text), result);
        });

        it("should recognize a template with syntax error missing ) in args", function () {
            var text = 't1(a ::= <<\na<a> b<b>\n>>';

            assert.equal(parseGroup(text).message, 'Expected ")", "," or "=" but ":" found.');
        });

        it("should recognize a template with syntax error bad ::=", function () {
            var text = 't1() := <<\na\n>>';

            assert.equal(parseGroup(text).message, 'Expected "::=" but ":" found.');
        });

        it("should recognize a template with syntax error missing template", function () {
            var text = 't1() ::= something else';

            assert.equal(parseGroup(text).message, 'Missing template.');
        });

        it("should recognize a template with syntax error unterminated string", function () {
            var text = 't1() ::= "abc';

            assert.equal(parseGroup(text).message, 'Unterminated string.');
            text = 't1() ::= "abc\n';
            assert.equal(parseGroup(text).message, 'Unterminated string.');
        });

        it("should recognize a template with syntax error unterminated big string", function () {
            var text = 't1() ::= <<\na';

            assert.equal(parseGroup(text).message, 'Unterminated big string.');
        });

        it("should recognize a template with syntax error unterminated big string ignore new lines", function () {
            var text = 't1() ::= <%\na';

            assert.equal(parseGroup(text).message, 'Unterminated big string.');
        });
    });

    // xxx many more tests needed: aliases, escaping, all kinds of expressions
});
