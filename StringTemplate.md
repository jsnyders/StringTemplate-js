# StringTemplate Documentation

StringTemplate is a language for describing how to combine structured data with literal text. It is also a 
library that processes that language.

A template system is a template processor or engine that processes the template language along with any application
specific code needed to acquire, access or generate the data and possibly store or transmit the resulting text.
The template processor is generally supplied as a library or program to be called by the application.
 
The purpose of a template system is to produce output text where the output is given by the input template(s).
The templates are made up of literal text that is copied to the output as is and embedded expressions that specify what 
data is to be inserted into the output.

xxx todo
template inputs
data 
compile/interpret runtime

## Templates
Templates are literal text with embedded template expressions. Expressions are delimited with a special start and stop
character. All text outside of these characters is copied to the output nearly verbatim (see Escaping Expression 
Delimiters below). Text inside the delimiters are template expressions that determine how data is to be inserted into
the output. 

StringTemplate templates enforce a separation between the template and the model (this is also known as model view 
separation). Templates cannot implement any business logic*. The template cannot modify the data model. 
Processing the template produces no side effects. Templates do have a constructs for if/else if/else conditionals, 
implicit looping over arrays/lists and the keys/properties of a map/object, a small number of functions that operate
on strings and arrays, a few options to control the output rendering, and calling templates with arguments.
These features are necessary for the efficient generation of output text. They are not sufficient to implement business
logic.

\* One place where it could be argued that templates allow business logic is in conditional expressions because
they allow boolean operators: and, or, and not. These operators are for convenience and provide very little opportunity
for abuse. You don't need to use these operators if you don't want to.

### Template Expression Delimiters
StringTemplate allows the start and stop delimiter characters to be configurable. This is useful for working with 
different text output formats. It allows you to choose characters that are uncommon in the output format. 
The default is determined by the implementation and can easily be changed through the processor API or with the
group file syntax described below.

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
dollar signs ($): `$name$` will be replaced with the data associated with attribute `name` and `$prize$` will be 
 replaced with the data associated with attribute `prize`.

If the delimiters were instead configured to be < and > then the above example would be written:
```
Dear <name>,
You may have already won <prize>. To collect your prize...
```

### Escaping Expression Delimiters
To include the start character in the literal template text it will need to be escaped. There is no need to escape
the stop character (assuming it is different from the start character)

The start character is escaped using the backslash character as follows: `\$`.

As we will learn later, sub templates are delimited with { } characters so inside a sub template the closing bracket
needs to be escaped. Again a backslash is used: `\}`. Outside a sub template the opening bracket needs to be escaped
using `\{`.

Normally you don't need to worry about escaping the backslash character but in situations where there is any ambiguity
you will need to escape it with another backslash like this: `\\`. 

This means that:

To get this output | Enter this in the template
-------------------|------------------------
 `$`               | `\$`
 `\`               | `\`
 `\\`              | `\\\\`
 `\$`              | `\\\$`
 `{`               | `\{`
 `\}`              | `\\}`
 `\}`              | `\\\}`
 `}`               | `\}`

The last tow only apply in a sub template.

xxx leave >> and %> escapes to later or include now?


## The data model
StringTemplate has very few data types. Most of how it deals with the data model is implementation specific. What it 
does know about is the shape of the data. Data can be one of the following shapes:

 * scalar - a single value. This includes obvious things like strings and numbers but also includes things like 
 a Point or Complex object.
 StringTemplate doesn't deal with specific types but relies on the implementation to be able to turn any scalar into 
 a string (for example via a toString method).

 * array - also known as a list or linear collection/enumeration. The items in the array can be of any shape or type.
 The values are ordered. StringTemplate will aways implicitly iterate over the array items.

 * object - also known as a map, dictionary, hash, record or structure.  This is an unordered collection of named values.
 The values can be of any shape or type. StringTemplate allows accessing the values by their name. This is known as 
 a property reference, access, or lookup. Depending on the context StringTemplate can also iterate over the 
 properties of an object.


xxx todo how each is handled
scalars turned into strings
arrays always iterated over and each 
special case for iterating over keys of a map

how data is supplied to the processor: dict, template arguments, literals

## Literals
Template expressions may include the following literals:

* The boolean values `true` and `false`.

* Strings. Sequences of characters enclosed in double quotes. Inside the double quotes these escape sequences
are supported to include special characters:
    - `\r` charage return
    - `\n` line feed
    - `\"` double quote
    - `\\` single back slash

* Lists 
$true$
$false$
$"string"$

Lists
 []
 [expr1, expr2,...]

## Character escape expressions
The following expressions are used to insert special characters in the output:

 * `$\ $` insert a single space
 * `$\n$` insert a new line. This will be converted to the appropriate line ending character or character sequence
 * `$\t$` insert a tab
 * `$\uhhhh$` insert a Unicode character where *hhhh* is the hex value of the Unicode character

The expression `$\\$` will suppress the following new line. This allows inserting a new line in the template for
better readability without including that new line in the output. 


## Comments
Inside templates you can include comments as follows:

```
$!this is a comment!$
```

See Groups below for comments you can have outside of templates.

## Expressions

### Attribute Expressions

attribute reference
property reference
attribute indirect
property indirect

include
map
zip

### Expression Options

separator
format
null
wrap
anchor


### Anonymous Sub Templates

### Functions
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

### Conditionals
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
