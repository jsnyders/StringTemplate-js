/*
 * stGrammar.pegjs
 * This is the grammar for StringTemplate including group files, template files, and raw templates
 */
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

{
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

    var delimiterStartChar = "<",
        delimiterStopChar = ">",
        curDict = null,
        outside = true;

    if (options) {
        delimiterStartChar = options.delimiterStartChar || "<";
        delimiterStopChar = options.delimiterStopChar || ">";
    }
    console.log("xxx initial delimiters are " + delimiterStartChar + ", " + delimiterStopChar);

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

}

/*
 * GROUP
 */

/*
 * There should be at least one definition but not enforced
 */
group
    = delimiters? i:import* d:def* EOF {
            return {
                imports: i || null,
                definitions: d || null
            };
        }

import
    = __ "import" __ file:STRING __ {
            console.log("xxx import file " + file.value);
        }

delimiters
    = __ "delimiters" __ s:STRING __ "," __ e:STRING {
            // xxx validate chars and each are 1 char exactly
            delimiterStartChar=s.value.charAt(0);
            delimiterStopChar=e.value.charAt(0);
            console.log(" xxx delimiters are " + delimiterStartChar + ", " + delimiterStopChar);
        }

def
    = templateDef
    / dictDef

templateDef
    = name:( "@" enclosing:ID "." n:ID "(" __ ")"
        /	n:ID "(" __ formalArgs __ ")"
        { return n; } )
        __ "::=" __
        (	s:STRING
        /	s:BIGSTRING
        /	s:BIGSTRING_NO_NL
        / { error("missing template"); }
        ) {
            console.log("xxx defined template " + name.value);
        }
    / alias:ID __ '::=' __ target:ID  { console.log("xxx alias " + alias.value); }

formalArgs
    = formalArg ( __ ',' __ formalArg)*
    /

formalArg
    = arg:ID
        (	'=' defVal:(STRING /*xxx|ANONYMOUS_TEMPLATE*/ / 'true' / 'false') { console.log("xxx default value is " + defVal.value); }
// xxx        |	'=' a='[' ']' {$formalArgs::hasOptionalParameter = true;}
        / { error("Missing formal argument default value"); }
        )
        { console.log(" xxx arg " + arg.value); }

dictDef
	= (__ id:ID __ '::=' { curDict = { type: "DICTIONARY", name: id.value, map: {}, default: null }; }) dict {
            return curDict;
        }

dict
	= __ "[" __ dictPairs "]" __

dictPairs
    = __ first:keyValuePair (__ ',' __ rest:keyValuePair)* (__ ',' __ def:defaultValuePair)?
    / __ def:defaultValuePair

defaultValuePair
    = "default" __ ":" __ v:keyValue __ { curDict.default = v; }

keyValuePair
    = k:STRING __ ':' __ v:keyValue __ { curDict.map[k.value] = v; }

keyValue
    = v:BIGSTRING           { return v.value; }
    / v:BIGSTRING_NO_NL     { return v.value; }
    / v:STRING              { return v.value; }
    / v:anonymousTemplate	{ return v; }
    / TRUE                  { return true; }
    / FALSE                 { return false;}
    / "key"                 { return 0; } // xxx need an out of band value for this
    / '[' __ ']'            { return []; }


// xxx this is very broken
anonymousTemplate
    = "{" (!"}" .)* "}" { return {
                type: "ANON_TEMPLATE",
                value: text() // xxx
            };
        }

/*
 * RAW TEMPLATE
 */
template
    = e:element* EOF { return {
                type: "TEMPLATE",
                value: e || null // xxx should this be null or text token with empty string value
            }
        }

element
    = &{return column() === 1;} INDENT? ST_COMMENT NEWLINE { return null; }
    / INDENT se:singleElement {
            return {
                type: "INDENTED_EXPR",
                value: se
            };
        }
    / se:singleElement {
            return se;
        }
    / ce:compoundElement {
            return ce;
        }

singleElement
    = TEXT
    / NEWLINE
    / ST_COMMENT { return null; }
    / exprTag

compoundElement
    = ifstat
    / region

exprTag
	= START e:expr ( ';' opts:exprOptions )? STOP {
	        return {
	            type: "EXPR",
	            expr: e,
	            options: opts
	        };
        }

region
    = INDENT? START '@' ID STOP template INDENT? START '@end' STOP

/*xxx        // kill \n for <@end> on line by itself if multi-line embedded region
        ({$region.start.getLine()!=input.LT(1).getLine()}?=> NEWLINE)?
        -> {indent!=null}?
           ^(INDENTED_EXPR $i ^(REGION[$x] ID template?))
        ->                    ^(REGION[$x] ID template?) */

  // ignore final INDENT before } as it's not part of outer indent
subtemplate
    = '{' ( args:formalArgsNoDefault '|' )? template INDENT? '}' {
            return {
                type: "SUBTEMPLATE",
                args: args.args,
                template: template
            };
        }

formalArgsNoDefault
    = first:ID ( __ ',' __ rest:ID)* {
            return {
                type: "ARGS",
                args: makeList(first, rest)
            }
        }

ifstat
	= i:INDENT? START 'if' '(' c1:conditional ')' STOP /*xxx{if (input.LA(1)!=NEWLINE) indent=$i;} */
        t1:template
        ( INDENT? START 'elseif' '(' c2:conditional ')' STOP t2:template )* // xxx how to gather all the t2s?
        ( INDENT? START 'else' STOP t3:template )?
        INDENT? START 'endif' STOP {
                return {
                    type: "IF"
                };
            }
/*xxx		// kill \n for <endif> on line by itself if multi-line IF
		({$ifstat.start.getLine()!=input.LT(1).getLine()}?=> NEWLINE)?
		-> {indent!=null}?
		   ^(INDENTED_EXPR $i ^('if' $c1 $t1? ^('elseif' $c2 $t2)* ^('else' $t3?)?))
		->                    ^('if' $c1 $t1? ^('elseif' $c2 $t2)* ^('else' $t3?)?) */

conditional
    = andConditional ( "||" andConditional )*

andConditional
    = notConditional ( "&&" notConditional )*

notConditional
    = "!" notConditional
    / memberExpr

exprOptions
    = option ( ',' option )* // xxx

/*
@init {
	String id = input.LT(1).getText();
	String defVal = Compiler.defaultOptionValues.get(id);
	boolean validOption = Compiler.supportedOptions.get(id)!=null;
...
        if ( !validOption ) {
            errMgr.compileTimeError(ErrorType.NO_SUCH_OPTION, templateToken, $ID, $ID.text);
        }

}
*/
option
    = ID ( "=" exprNoComma )?

exprNoComma
    = me:memberExpr ( ':' tr:mapTemplateRef )? {
            if (tr) {
                return {
                    type: "MAP",
                    expr: me,
                    template: tr
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
            ":" x:mapTemplateRef ({$c==null}?=> ',' xs:mapTemplateRef )* {
                    return {
                        type
                    };
                }
//xxx                                                -> ^(MAP[$col] $mapExpr $x+)
        )*
*/

mapExpr
    = memberExpr ( ( __ "," __ memberExpr )+ __ ":" __ mapTemplateRef )?
          ( ":" __ mapTemplateRef ( __ "," __ mapTemplateRef )*  )*

/**
expr:template(args)  apply template to expr
expr:{arg | ...}     apply subtemplate to expr
expr:(e)(args)       convert e to a string template name and apply to expr
*/
//xxx
mapTemplateRef
    = ID '(' args ')' //xxx							-> ^(INCLUDE ID args?)
    / subtemplate
    / '(' mapExpr ')' '(' argExprList? ')' // xxx -> ^(INCLUDE_IND mapExpr argExprList?)

memberExpr
    = includeExpr ( '.' ID / '.' '(' mapExpr ')' )*

includeExpr
    = i:ID &{ return isFunction(i.value); } '(' e:expr? ')' {
            return {
                type: "FUNCTION",
                name: i,
                arg: e
            };
        }
    / "super." i:ID '(' a:args ')' {
            return {
                type: "INCLUDE_SUPER",
                name: i,
                args: a
            };
        }
    / i:ID '(' a:args ')' {
             return {
                 type: "INCLUDE",
                 name: i,
                 args: a
             };
         }
//xxx	|	'@' 'super' '.' ID '(' rp=')'			-> ^(INCLUDE_SUPER_REGION ID)
//xxx	|	'@' ID '(' rp=')'						-> ^(INCLUDE_REGION ID)
    / primary

primary
    = TRUE
    / FALSE
    / ID
    / STRING
    / subtemplate
    / list
//xxx    |	{$conditional.size()>0}?=>  '('! conditional ')'!
//    |	{$conditional.size()==0}?=> lp='(' expr ')'
//        (	'(' argExprList? ')'		        -> ^(INCLUDE_IND[$lp] expr argExprList?)
//        |										-> ^(TO_STR[$lp] expr)
//        )

args
    = argExprList?
	/ first:namedArg ( __ ',' __ rest:namedArg )* (__ ',' __ pt:'...')? {
	        return {
                type: "ARGS",
                value: makeList(first, rest), // xxx what to do with pt?
	        };
	    }
    / '...' { return { type: "PASSTHROUGH" }; }

argExprList
    = first:arg ( __ ',' __ rest:arg )* {
            return {
                type: "ARGS",
                value: makeList(first, rest)
            };
        }

arg
    = exprNoComma

namedArg
    = i:ID __ '=' __ v:arg {
            return {
                type: "ARG",
                name: i,
                value: v
            };
        }

list
    = "[" __ first:listElement? ( __ "," __ rest:listElement )* __ "]" {
            return {
                type: "LIST",
                value: makeList(fist, rest)
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

ID	"identifier"
	= !(RESERVED) [a-zA-Z_/] [a-zA-Z_/0-9]* {
	        return {
	            type: "ID",
	            value: text()
	        };
	    }

// xxx ST seems to allow some of these in some contexts
RESERVED
    = "true"
    / "false"
    / "if"
    / "else"
    / "elseif"
    / "endif"
    / "super"

TRUE
    = "true" { return { type: "TRUE" }; }

FALSE
    = "false" { return { type: "FALSE" }; }

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
                value: chars.join("") // xxx escapes
            };
        }

BIGSTRING_CHAR
    = !(">>" / "\\>>" / ">\\>") . { return text(); }
    / "\\>>" { return ">>"; }
    / ">\\>" { return ">>"; }
//xxx    / EOF { error("Unterminated big string"); }

// same as BIGSTRING but means ignore newlines later
BIGSTRING_NO_NL "big string"
    = "<%" (!"%>" .)* "%>" {
            var txt = text();
            return {
                type: "BIGSTRING_NO_NL", // xxx consider "BIGSTRING"
                value: {
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
            return { type: "INDENT" };
        }

START
    = &{return outside;} !( START_CHAR "!") START_CHAR {
            console.log("xxx found start");
            outside = false;
            return { type: "START" };
        }

START_CHAR
    = &{ return (input.charAt(peg$currPos) === delimiterStartChar) } .

ST_COMMENT
    = &{return outside;} START_CHAR "!" (!("!" STOP_CHAR) .)* "!" STOP_CHAR {
            return { type: "ST_COMMENT" };
        }

TEXT
    = &{return outside;} TEXT_CHAR+ {
            return {
                type: "TEXT",
                value: text()
            };
        }

TEXT_CHAR
    = !(EOL / START_CHAR / "\\" START_CHAR) . {
            return text();
        }
    / "\\" START_CHAR { return delimiterStartChar; }

NEWLINE
    = &{return outside;} EOL {
            console.log("xxx found new line");
            return {
                type: "NEWLINE",
                value: text()
            }
        }

STOP "stop delimiter"
    = !{return outside;} STOP_CHAR {
            console.log("xxx found stop");
            outside = true;
            return { type: "STOP" };
        }

STOP_CHAR
    = &{ return (input.charAt(peg$currPos) === delimiterStopChar) } .
