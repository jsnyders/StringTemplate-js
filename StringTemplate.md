# StringTemplate Documentation

StringTemplate is a language for describing how to combine structured data with literal text. It is also a 
library that processes that language.

A template system is a template processor or engine that processes the template language along with any application
 specific code needed to acquire, access or generate the data and possibly store or transmit the resulting text.
 The template processor is generally supplied as a library or program to be called by the application.
 
The purpose of a template system is to produce output text where the output is given by the input template(s).
 The templates are made up of literal text that is copied to the output as is and embedded expressions that specify how 
 data is to be inserted into the output.

xxx todo
template inputs
data 
compile/interpret runtime
goal is to produce an output string or document.

## Templates
Templates are literal text with embedded template expressions. Expressions are delimited with a special start and stop
character. All text outside of these characters is copied to the output nearly verbatim (see Escaping Expression 
Delimiters below). Text inside the delimiters are template expressions that determine how data is to be inserted into
the output. 

todo
arguments
no logic 
no side effects

## Template Expression Delimiters
StringTemplate allows the delimiter characters to be configurable. The default is determined by the implementation
and can easily be changed.

The following characters can be used as start or stop delimiters. The start and stop delimiter need not be the same
character. 

Possible start and stop delimiters:

```
#$%^&*<>
```

Common delimiter pairs are <> and $$. Most of the examples in this documentation use $$.

Example:
```
Dear $name$,
You may have already won $prize$. To collect your prize...
```

As will be explained in detail below all of the text is copied verbatim to the output except for what is inside the
dolor signs ($): `$name$` will be replaced with the data associated with attribute `name` and `$prize$` will be 
 replaced with the data associated with attribute `prize`.

If the delimiters were instead configured to be < and > then the above example would be written:
```
Dear <name>,
You may have already won <prize>. To collect your prize...
```
 

## Escaping Expression Delimiters
To include the start character in the literal text it will need to be escaped. There is no need to escape the stop 
character (assuming it is different from the start character)

The start character is escaped using the backslash character as follows: `\$`

As we will learn later sub templates are delimited with { } characters so inside a sub template the closing bracket
needs to be escaped. Again a backslash is used: `\}`. 

Normally you don't need to worry about escaping the backslash character but in situations where there is any ambiguity
you will need to escape it with another backslash like this: `\\`. 

This means that:

To get this output | Enter this in the template
-------------------|------------------------
 $                 | \$
 \                 | \
 \\                | \\\\
 \$                | \\\$
 }                 | \}
 \}                | \\}

The last two only apply in a sub template.

xxx leave >> and %> escapes to later or include now?


## The data model
todo
read only
scalars 
objects/maps/hashes/records/structs
arrays/lists/collections

todo how each is handled
scalars turned into strings
arrays always iterated over and each 
special case for iterating over keys of a map

## Literals

$true$
$false$
$"string"$

Lists
 []
 [expr1, expr2,...]

Escapes:
$ $
$\n$
$\t$
$\uhhhh$
$\\$


## Comments
Inside expressions you can include comments as follows:

```
$! this is a comment !$
```

See Groups below for comments you can have outside of templates.

## Attribute Expressions

attribute reference
property reference
attribute indirect
property indirect

include
map
zip

## Expression Options

separator
format
null
wrap
anchor


## Anonymous Sub Templates

## Functions
todo:
first
rest
last
trunc
strip
reverse
length

strlen
trim

## Conditionals
todo:
if
elseif
else
endif

todo explain evaluation of conditions
 !, &&, ||


## Template definitions

todo

## Raw Templates

todo

## Groups

todo

group inheritance

## Regions

TODO
