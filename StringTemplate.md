# StringTemplate Documentation

StringTemplate is a language for describing how to combine structured data with literal text.

todo
template inputs
data 
template processor
compile/interpret runtime
goal is to produce an output string or document.

## Templates
Templates are literal text with embedded template expressions. Expressions are delimited with a special start and stop
character. All text outside of these characters is copied to the output nearly verbatim (see Escaping Expression 
Delimiters below) . Text inside the delimiters are template expressions that determine how data is to be inserted into
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
```
#$%^&*<>
```
Common delimiter pairs are <> and $$. Most of the examples in this documentation use $$.

## Escaping Expression Delimiters

todo including the start and stop delimiters in the literal template text 
Start char \$ works
xxx No need to escape the stop character 
Backslash alone \ is fine as is \\ and \\\$.
and \} is needed inside an anon sub template

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
