/*
 [The "BSD licence"]
 Copyright (c) 2015, John Snyders
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*
 * stGrammar.pegjs
 * This is the grammar for StringTemplate including group files, template files, and raw templates
 * current command to compile this is:
 *    pegjs --allowed-start-rules groupFile,templateFile,templateFileRaw,templateAndEOF stGrammar.pegjs
 */

{
    var VALID_DELIMITERS =  "#$%^&*<>";

    var delimiterStartChar = "<",
        delimiterStopChar = ">",
        curGroup = options.group,
        curDict = null,
        outside = true, // tell if we are inside or outside a template: outside<inside>outside
        subtemplateDepth = 0, // handle nesting of subtemplates: { ... {...} ...}
        inConditional = false,
        verbose = false,
        ignoreNewLines = options.ignoreNewLines || false,
        formalArgsHasOptional = false;

    var logger = function(message) {
        console.log(message);
    };

    function verboseLog(message) {
        if (verbose) {
            logger(message);
        }
    }

    function makeList(first, rest) {
        var list;
        if (first && rest) {
            list = [first].concat(rest);
        } else if (first) {
            list = [first];
        } else if (rest) {
            list = rest;
        } else {
            list = [];
        }
        return list;
    }

    function parseTemplate(template) {
        var ignoreNewLines,
            lineOffset = line() - 1;

        ignoreNewLines = false;
        if (template.ignoreNewLines) {
            ignoreNewLines = true;
            template = template.string;
        }
        if (template.charAt(0) === "\n" || (template.charAt(0) === "\r" && template.charAt(1) === "\n")) {
            lineOffset += 1;
        }
        template = template.replace(/^\r?\n/, "") // remove a single leading new line if any

        outside = true; // just in case, make sure always start parsing a template on the outside
        try {
            return parse(template, {
                startRule: "templateAndEOF",
                group: curGroup,
                nested: true,
                verbose: verbose,
                ignoreNewLines: ignoreNewLines,
                delimiterStartChar: delimiterStartChar,
                delimiterStopChar: delimiterStopChar
            });
        } catch(ex) {
            if (ex instanceof SyntaxError) {
                ex.line += lineOffset;
            }
            throw ex;
        }
    }

    delimiterStartChar = options.delimiterStartChar || "<";
    delimiterStopChar = options.delimiterStopChar || ">";
    verbose = options.verbose || false;
    if (options.logger) {
        logger = options.logger;
    }

    if (!options.nested) {
        verboseLog("Default delimiters: " + delimiterStartChar + ", " + delimiterStopChar);
    }

}

/*
 * GROUP
 */

/*
 * ENTRY POINT: groupFile
 * This entry point is for a .stg file.
 *
 * There should be at least one definition but not enforced
 */
groupFile
    = __ delimiters? __ import* __ def* __ EOF {
            return curGroup;
        }

/*
 * Match:
 *   import "<filename>"
 */
import
    = __ "import" __ file:STRING __ {
            curGroup.addImports(file.value);
            return null;
        }

/*
 * Match:
 *   delimiters "<char>", "<char>"
 * <char> must be a valid delimiter.
 */
delimiters
    = "delimiters" __ s:STRING __ "," __ e:STRING {
            var start = s.value,
                stop = e.value;
            if (start.length !== 1 || stop.length !== 1) {
                error("Delimiter value must be exactly one character");
            }
            if (VALID_DELIMITERS.indexOf(start) < 0 || VALID_DELIMITERS.indexOf(stop) < 0) {
                error("Invalid delimiter character");
            }
            delimiterStartChar=s.value.charAt(0);
            delimiterStopChar=e.value.charAt(0);
            verboseLog("Delimiters: " + delimiterStartChar + ", " + delimiterStopChar);
            return null;
        }

/*
 * Match a dictionary or template definition
 */
def
    = __ dictDef __ { return null; }
    / __ templateDef __ { return null; }

/*
 * Template and region definitions and template aliases
 * Match:
 *   <name>(<args>) ::= << <template-body> >>   // multi-line template
 *   <name>(<args>) ::= <% <template-body> %>   // multi-line template new lines not significant
 *   <name>(<args>) ::= "<template-body>"       // single line template
 *   <aliasName> ::= <templateName>
 *   @<enclosingTemplate>.<regionName>() ::= << <template-body> >>
 *   @<enclosingTemplate>.<regionName>() ::= <% <template-body> %>
 *   @<enclosingTemplate>.<regionName>() ::= " <template-body> "
 */
templateDef
    = def:( "@" enclosing:ID "." n:ID "(" __ ")" {
                    // todo region stuff
                    return {
                        name: n.value,
                        enclosingTemplate: enclosing.value
                    };
                }
            /	n:ID "(" __ args:formalArgs __ ")" {
                    return {
                        name: n.value,
                        args: args
                    };
                }
        )
        __ "::=" __
        template:(
            s:STRING { return s.value; }
            / s:BIGSTRING { return s.value; }
            / s:BIGSTRING_NO_NL { return s.value; }
            / { error("Missing template"); }
        ) {
            if (def.enclosingTemplate) {
                verboseLog("Region definition: " + def.enclosingTemplate + "." + def.name);
                def.template = parseTemplate(template).value;
                curGroup.addRegion(def);
            } else {
                verboseLog("Template definition: " + def.name);
                def.template = parseTemplate(template).value;
                curGroup.addTemplate(def);
            }
            return null;
        }
    / alias:ID __ '::=' __ target:ID  {
            verboseLog("Template alias: " + alias.value + " > " + target.value);
            curGroup.addTemplateAlias(alias.value, target.value);
            return null;
        }

formalArgs
    = &{ formalArgsHasOptional = false; return true; } first:formalArg rest:( __ "," __ e:formalArg { return e; } )* {
            return makeList(first, rest);
        }
    / { return []; }

formalArg
    = name:ID defaultValue:( __ '=' __
            v:( STRING
                / anonymousTemplate
                / TRUE
                / FALSE
                / EMPTY_LIST ) {
                        formalArgsHasOptional = true;
                        return v;
                    }
        )? {
                var ret;

                if (formalArgsHasOptional && defaultValue === null) {
                    error("Required argument after optional not allowed.");
                }
                ret = {
                    type: "FORMAL_ARG",
                    name: name.value,
                };
                if (defaultValue) {
                    ret.defaultValue = defaultValue;
                }
                return ret;
            }

dictDef
	= (__ id:ID __ '::=' { curDict = { name: id.value, map: {}, default: null }; }) dict {
            verboseLog("Dictionary definition: " + curDict.name);
            curGroup.addDictionary(curDict);
            curDict = null;
            return null;
        }

dict
	= __ "[" __ dictPairs "]" __

dictPairs
    = __ keyValuePair (__ "," __ keyValuePair)* (__ "," __ defaultValuePair)?
    / __ def:defaultValuePair

defaultValuePair
    = "default" __ ":" __ v:keyValue __ { curDict.default = v; }

keyValuePair
    = k:STRING __ ':' __ v:keyValue __ { curDict.map[k.value] = v; }

keyValue
    = v:BIGSTRING {
            return {
                type: "ANON_TEMPLATE",
                value: parseTemplate(v.value).value
            };
        }
    / v:BIGSTRING_NO_NL {
            return {
                type: "ANON_TEMPLATE",
                value: parseTemplate(v.value).value
            };
        }
    / STRING
    / anonymousTemplate 
    / TRUE
    / FALSE
    / "key" { return { type: "DICT_KEY_VALUE", value: null }; }
    / EMPTY_LIST


/* 
 * Anonymous template
 * Match:
 *   {<template-body>}
 */
anonymousTemplate
    = "{" &{subtemplateDepth += 1; return true;} 
        t:template "}" {
            subtemplateDepth -= 1; // xxx is this subtemplate depth stuff needed?
            return {
                type: "ANON_TEMPLATE",
                value: t.value
            };
        }


/*
 * TEMPLATE FILE
 */
/*
 * ENTRY POINT: templateFile
 * This entry point is for a non-raw .st file
 * Testing with Java reference implementation shows that region and alias definitions are not useful in .st files
 * even though they are allowed while parsing.
 */
templateFile
    = __ name:ID "(" __ args:formalArgs __ ")"
        __ "::=" __
        template:(
            s:STRING { return s.value; }
            / s:BIGSTRING { return s.value; }
            / s:BIGSTRING_NO_NL { return s.value; }
            / { error("Missing template"); }
        ) __ {
            if (name.value !== curGroup.fileName) {
                error("Template name must match filename.");
            }
            verboseLog("Template definition: " + name.value);
            curGroup.addTemplate({
                name: name.value,
                args: args,
                template: parseTemplate(template).value
            });
            return curGroup;
        }

/*
 * RAW TEMPLATE
 */

/*
 * ENTRY POINT: templateAndEOF
 * This entry point is used internally to parse the body of a template definition
 */
templateAndEOF
    = t:template EOF {
            return t;
        }

/*
 * ENTRY POINT: templateFileRaw
 * This entry point is for raw .st files
 */
templateFileRaw
    = t:template EOF {
            curGroup.addTemplate({
                name: curGroup.fileName,
                args: null, // xxx is this OK?
                template: t.value
            });
            return curGroup;
        }

/* xxx the !(...) used to include / "}" why was that? */
template
    = e:(!(INDENT? START_CHAR "elseif" / INDENT? START_CHAR "else" / INDENT? START_CHAR "endif"  ) i:element { return i; })* { return {
                type: "TEMPLATE",
                value: e || null // xxx should this be null or text token with empty string value
            };
        }

/*
 * Match any of the elements of an expression
 */
element
    = &{return column() === 1;} INDENT? ST_COMMENT NEWLINE { return null; }  // a comment optionally preceded by indent
                                                                             // and immediately followed by a new line
                                                                             // is ignored including the newline
    / i:INDENT se:singleElement {
            if (ignoreNewLines) {
                return se;
            } else {
                return {
                    type: "INDENTED_EXPR",
                    indent: i.value,
                    value: se
                };
            }
        }
    / &{ outside = true; return true; } se:singleElement {
            return se;
        }
    / &{ outside = true; return true; } ce:compoundElement {
            return ce;
        }


singleElement
    = TEXT
    / n:NEWLINE {
            if (ignoreNewLines) {
                return null;
            } else {
                return n;
            }
        }
    / ST_COMMENT { return null; }
    / exprTag

compoundElement
    = ifstat
    / region

exprTag
	= START __ e:expr opts:( ';' o:exprOptions { return o; } )? __ STOP {
	        var ret = {
	            type: "EXPR",
	            expr: e
	        };
	        if (opts) {
	            ret.options = opts;
	        }
	        return ret;
        }

// xxx todo region stuff
region
    = INDENT? START '@' ID STOP template INDENT? START '@end' STOP

/*xxx        // kill \n for <@end> on line by itself if multi-line embedded region
        ({$region.start.getLine()!=input.LT(1).getLine()}?=> NEWLINE)?
        -> {indent!=null}?
           ^(INDENTED_EXPR $i ^(REGION[$x] ID template?))
        ->                    ^(REGION[$x] ID template?) */


/* 
 * Anonymous sub template
 * Match:
 *   {<args>|<template-body>}
 *   {<template-body>}
 *
 * ignore final INDENT before } as it's not part of outer indent
 */
subtemplate
    = "{" &{subtemplateDepth += 1; return true;} args:( __ a:formalArgsNoDefault __ "|" __ {return a;})? 
        t:template INDENT? __ "}" {
            subtemplateDepth -= 1;
            outside = false;
            return {
                type: "SUBTEMPLATE",
                args: args,
                template: t.value
            };
        }
 
formalArgsNoDefault
    = first:ID 
            rest:( __ "," __ a:ID { return {
                                            type: "FORMAL_ARG",
                                            name: a.value
                                        };
                                    })* {
            return makeList({type: "FORMAL_ARG", name: first.value}, rest);
        }

ifstat
	= i:INDENT? START "if" __ "(" __ 
	            &{inConditional = true; return true;} c:conditional &{inConditional = false; return true;}
	             __ ")" STOP /*xxx{if (input.LA(1)!=NEWLINE) indent=$i;} */
        t:template
        ei:( !(INDENT? START_CHAR "else" STOP_CHAR / INDENT? START_CHAR "endif" STOP_CHAR)
            INDENT? START "elseif" __ "(" __ 
                    &{inConditional = true; return true;} c:conditional &{inConditional = false; return true;} 
                    __ ")" STOP t:template {
                return {
                    type: "ELSEIF",
                    condition: c,
                    template: t.value
                };
            })*
        e:( !(INDENT? START_CHAR "endif" STOP_CHAR)
            INDENT? START "else" STOP t:template {
                return {
                    type: "ELSE",
                    template: t.value
                };
            })?
        INDENT? START "endif" STOP {
                return {
                    type: "IF",
                    condition: c,
                    template: t.value,
                    elseifPart: ei,
                    elsePart: e
                };
            }
/*xxx		// kill \n for <endif> on line by itself if multi-line IF
		({$ifstat.start.getLine()!=input.LT(1).getLine()}?=> NEWLINE)?
		-> {indent!=null}?
		   ^(INDENTED_EXPR $i ^('if' $c1 $t1? ^('elseif' $c2 $t2)* ^('else' $t3?)?))
		->                    ^('if' $c1 $t1? ^('elseif' $c2 $t2)* ^('else' $t3?)?) */

conditional
    = l:andConditional __ "||" __ r:conditional {
            return {
                type: "OR",
                left: l,
                right: r
            };
        }
    / andConditional

andConditional
    = l:notConditional __ "&&" __ r:andConditional {
            return {
                type: "AND",
                left: l,
                right: r
            };
        }
    / notConditional

notConditional
    = "!" __ n:notConditional {
            return { 
                type: "NOT",
                value: n
            };
        }
    / e:memberExpr


exprOptions
    = first:option rest:( __ "," __ o:option { return o; } )* {
            return makeList(first, rest);
        }

option
    = name:ID val:( __ "=" __ e:exprNoComma { return e; } )? {
            var optionName = name.value,
                value;
            if (!curGroup.isValidOption(optionName)) {
                error("No such option " + optionName);
            }

            value = val || curGroup.defaultOptionValue(optionName);
            if (value === null) {
                error("Value required for option " + optionName);
            }
            return {
                name: optionName,
                value: value
            };
        }

exprNoComma
    = me:memberExpr ref:( ':' tr:mapTemplateRef { return tr; } )? {
            if (ref) {
                return {
                    type: "MAP",
                    expr: me,
                    using: ref
                };
            } else {
                return me;
            }
        }

expr "expression"
    = mapExpr

/*xxx
// xxx comment from ST
// more complicated than necessary to avoid backtracking, which ruins
// error handling
mapExpr
    = first:memberExpr ( ("," rest:memberExpr)+ ":" mapTemplateRef {
                    return {
                        type: "ZIP",
                        value: "xxx" // ^(ELEMENTS memberExpr+) mapTemplateRef
                    }
            })
        / { return first; }
        )
        (	 /// xxx {if ($x!=null) $x.clear();} // don't keep queueing x; new list for each iteration
            ":" x:mapTemplateRef ({$c==null}?=> "," xs:mapTemplateRef )* {
                    return {
                        type
                    };
                }
//xxx                                                -> ^(MAP[$col] $mapExpr $x+)
        )*
*/

/*
 * xxx
 */
mapExpr
    = m1:memberExpr zip:( mn:( __ "," __ m:memberExpr { return m; } )+ __ ":" __ tr:mapTemplateRef { return [ mn, tr ]; } )?
        maps:( __ ":" __ first:mapTemplateRef rest:( __ "," __ r:mapTemplateRef { return r; } )* { return makeList(first, rest); } )* {
                var i, expr, res = m1;
                if (zip) {
                    res = {
                        type: "ZIP",
                        expr: makeList(m1, zip[0]),
                        using: zip[1]
                    };
                }
                if (maps.length > 0) {
                    res = {
                        type: "MAP",
                        expr: res,
                        using: maps
                    };
                    // need to handle the implicit first argument
                    // xxx deal with array of arrays here
                    for (var i = 0; i < maps[0].length; i++) {
                        expr = maps[0][i];
                        if (expr.type === "INCLUDE") {
                            expr.args.splice(0, 0, {
                                                   "type": "STRING",
                                                   "value": ""
                                               });
                        }
                    }
                }
                return res;
            }

/*
 * Match:
 * expr:template(args)  apply template to expr
 * expr:{arg | ...}     apply subtemplate to expr
 * expr:(e)(args)       convert e to a string template name and apply to expr
 */
mapTemplateRef
    = i:ID '(' a:args ')' {
            return {
                type: "INCLUDE",
                templateName: i.value,
                args: a.value,
            };
        }
    / subtemplate
    / '(' mapExpr ')' '(' argExprList? ')' // xxx -> ^(INCLUDE_IND mapExpr argExprList?)

/*
 * Match:
 *   <attribute>.<property>             // value of property of object attribute
 *   <attribute>.<property>.<property>  // any number of levels of property references
 *   <attribute>.(<expr>)               // indirect property reference. value of expr is name of property of object attribute
 *   <attribute>.(<expr>).(<expr>)      // any number of levels allowed
 *   <attribute>.<property>.(<expr>).   // can mix direct and indirect property references
 *
 * xxx it seems strange that member references are allowed on anything other than an attribute
 *  what does true.myProp mean?
 *  or template(arg1, arg2).prop2
 */
memberExpr
    = e:includeExpr
        props:( '.' prop:ID {
                return {
                    type: "PROP",
                    property: prop.value
                };
            }
        / '.' '(' e:mapExpr ')' {
                return {
                    type: "PROP_IND",
                    property: e
                };
            }
        )* {
                if (props.length > 0) {
                    return {
                        type: "MEMBER_EXPR",
                        object: e,
                        properties: props  // xxx is this being an array a problem?
                    };
                } else {
                    return e;
                }
            }
/*
 * Handle template includes as well as functions because the syntax is the same 
 * Match:
 *   <func>(<expr>)     // func is one of the built in functions: first, length, strlen, last, rest, reverse, trunc, strip, trim
 * super.<template-name>(<args>)
 * <template-name>(<args>)
 * xxx
 *   Or primary
 */
includeExpr
    = i:ID &{ return curGroup.isFunction(i.value); } __ '(' __ e:expr? __ ')' {
            return {
                type: "FUNCTION",
                name: i.value,
                arg: e
            };
        }
    / "super." i:ID '(' a:args ')' { // xxx todo region stuff
            return {
                type: "INCLUDE_SUPER",
                name: i.value,
                args: a
            };
        }
    / i:ID '(' a:args ')' {
             return {
                 type: "INCLUDE",
                 templateName: i.value,
                 args: a.value,
                 argsNamed: !!a.named,
                 argsPassThrough: !!a.passThrough
             };
         }
// xxx todo region stuff
//xxx	|	'@' 'super' '.' ID '(' rp=')'			-> ^(INCLUDE_SUPER_REGION ID)
//xxx	|	'@' ID '(' rp=')'						-> ^(INCLUDE_REGION ID)
    / primary

/*
 * Match:
 *   true
 *   false
 *   <attribute>
 *   <string>
 *   <sub-template>
 *   <list>
 * if currently parsing a condition
 *   ( <conditional> )
 * else
 *   (<expr>)
 *   (<expr>)(<args>)
 */
primary
    = TRUE
    / FALSE
    / i:ID { return {
                type: "ATTRIBUTE",
                name: i.value
            };
        }
    / s:STRING { return s; }
    / subtemplate
    / list
    / &{return inConditional;} "(" c:conditional ")" { return c; }
    / &{return !inConditional;} "(" e:expr ")" a:(	"(" a:argExprList? ")" { return a; } )? {
            if (a) {
                return {
                    type: "INCLUDE_IND",
                    expr: e,
                    args: a.value
                };
            } else {
                return {
                    type: "TO_STR",
                    expr:  e
                };
            }
        }

args
    = first:namedArg rest:( __ "," __ a:namedArg { return a; } )* passThrough:( __ "," __ pt:'...' { return true; })? {
	        var ret = {
                type: "ARGS",
                value: makeList(first, rest),
                named: true,
                passThrough: !!passThrough
	        };
	        return ret;
	    }
    / '...' {
            return {
                type: "ARGS",
                value: [],
                passThrough: true
            };
        }
	/ argExprList

argExprList
    = first:arg rest:( __ "," __ a:arg { return a; } )* {
            return {
                type: "ARGS",
                value: makeList(first, rest)
            };
        }
    / {
            return {
                type: "ARGS",
                value: []
            };
        }

arg
    = exprNoComma

namedArg
    = i:ID __ "=" __ v:arg {
            v.argName = i.value;
            return v;
        }

/*
 * Match:
 *  [ <expr>* ]
 */
list
    = "[" __ first:listElement? rest:( __ "," __ i:listElement { return i; } )* __ "]" {
            return {
                type: "LIST",
                value: makeList(first, rest)
            };
        }

listElement
    = exprNoComma
    / { return null; }

/*
 * lexical terminals
 */

WS_CHAR
    = " "
    / "\t"

EOL "end of line"
    = "\n"
    / "\r\n"
    / "\r"

COMMENT
    = "/*" (!"*/" .)* "*/"

LINE_COMMENT
    = "//" (!EOL .)*

__ "white space"
    = (WS_CHAR / EOL / COMMENT / LINE_COMMENT )*

/*
 * xxx when defining a template "/" is not allowed but in a template when referencing a template it is.
 */
ID	"identifier"
	= !(RESERVED) [a-zA-Z_/] [a-zA-Z_/0-9]* {
	        return {
	            type: "ID",
	            value: text()
	        };
	    }

/*
 * According to the doc these are all "reserved words" but the Java ST parser seems to allow some in some contexts
 * true, false, import, default, key, group, implements, first, last, rest, trunc, strip, trim, length, strlen, reverse, if, else, elseif, endif, delimiters
 */
RESERVED
    = "true"
    / "false"
    / "if"
    / "else "
    / "elseif "
    / "endif "
    / "super"
/*xxx    / "import" should be able to have a template by this name */
/*xxx    / "default" should be able to have a property by this name */
/*    / "key" xxx */
    / "group"
    / "delimiters"
// This is old v3 keyword so allow it
//    / "implements"
// The functions need to be included as identifiers because they are tested to be functions later

TRUE
    = "true" { return { type: "BOOLEAN", value: true }; }

FALSE
    = "false" { return { type: "BOOLEAN", value: false }; }

EMPTY_LIST
    = '[' __ ']' { return { type: "EMPTY_LIST", value: null }; }

STRING "string"
    = '"' chars:STRING_CHAR* '"' {
            return { type: "STRING", value: chars.join("") };
        }

STRING_CHAR
    = !('"' / "\\" / "\r" / "\n") . { return text(); }
    / "\\" sequence:ESCAPE_CHAR { return sequence; }
    / EOL { error("Unterminated string"); }

ESCAPE_CHAR
    = "n" { return "\n"; }
    / "r" { return "\r"; }
    / "t" { return "\t"; }
    / . { return text(); }

/** Match <<...>> but also allow <<..<x>>> so we can have tag on end.
    Escapes: >\> means >> inside of <<...>>.
    Escapes: \>> means >> inside of <<...>> unless at end like <<...\>>>>.
    In that case, use <%..>>%> instead.
 */
BIGSTRING "big string"
    = "<<" chars:BIGSTRING_CHAR* ">>" {
            return {
                type: "BIGSTRING",
                value: chars.join("")
            };
        }

BIGSTRING_CHAR
    = !(">>" / "\\>>" / ">\\>") . { return text(); }
    / "\\>>" { return ">>"; }
    / ">\\>" { return ">>"; }
    / EOF { error("Unterminated big string"); }

// same as BIGSTRING but means ignore newlines later
BIGSTRING_NO_NL "big string"
    = "<%" (!"%>" .)* "%>" {
            var txt = text();
            return {
                type: "BIGSTRING_NO_NL",
                value: { // xxx
                    ignoreNewLines: true,
                    // %\> is the escape to avoid end of string
                    string: txt.substring(2, txt.length - 2).replace(/\%\\>/g, "%>")
                }
            };
        }

EOF "end of file"
    = !.

/*
 * OUTSIDE
 */

INDENT
    = &{return outside && column() === 1;} WS_CHAR+ {
            return {
                type: "INDENT",
                value: text()
            };
        }

START
    = &{return outside;} !( START_CHAR "!") START_CHAR {
            outside = false;
            return { type: "START" };
        }
/*
 * Character that starts an expression. This is configurable. Typically < or $
 */
START_CHAR
    = &{ return (input.charAt(peg$currPos) === delimiterStartChar); } .

/*
 * <! comment !>
 */
ST_COMMENT
    = &{return outside;} START_CHAR "!" (!("!" STOP_CHAR) .)* "!" STOP_CHAR {
            return { type: "ST_COMMENT" };
        }
/*
 * Any text outside an expression except for new lines
 * text returned as is except for escapes
 */
TEXT
    = &{return outside;} chars:TEXT_CHAR+ {
            return {
                type: "TEXT",
                value: chars.join("") // can't use text() unless it fixes up escapes
            };
        }

/*
 * \< -> < 
 * <\\> ([ \t])*(\r|\r\n|\n) ->   // ignores new line
 * don't match end of line, $, or } (if in a sub template)
 * otherwise:  . -> .
 */
TEXT_CHAR
    = !(EOL / START_CHAR / "\\" START_CHAR / "\\\\" / "\\}" /  &{return subtemplateDepth > 0;} "}") . {
            return text();
        }
    / "\\" START_CHAR { return delimiterStartChar; }
    / "\\\\" { return "\\"; }
    / "\\}" { return String.fromCharCode(125); } /* pegjs doesn't like "}" in the action */
    / "\\" { return "\\"; }
    / START_CHAR !("\\\\") e:ESCAPE STOP_CHAR { return e; }
    / START_CHAR "\\\\" STOP_CHAR WS_CHAR* EOL { return ""; }

/*
 * <\ >, <\n>, <\t>  -> space, new line, tab
 * <\uhhhh> -> Unicode character (hhhh is a hex number)
 */
ESCAPE
    = "\\" ch:( "u" HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT { return String.fromCharCode(parseInt(text().substr(1), 16)); }
        / "n" { return "\n"; }
        / "t" { return "\t"; }
        / " " { return " "; }
        / . {
                error("Invalid escape character '" + text() + "'");
            }
        ) { return ch; }

HEX_DIGIT
    = [0-9a-fA-F]

NEWLINE
    = &{return outside;} EOL {
            return {
                type: "NEWLINE",
                value: text()
            };
        }

/*
 * INSIDE
 */
STOP "stop delimiter"
    = !{return outside;} STOP_CHAR {
            outside = true;
            return { type: "STOP" };
        }
/*
 * Character that stops an expression. This is configurable. Typically > or $
 */
STOP_CHAR
    = &{ return (input.charAt(peg$currPos) === delimiterStopChar); } .
