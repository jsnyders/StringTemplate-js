/*
This is a very simple template with just one attribute substitution
compile with:
    stc hello.st
execute with:
    stst hello hello.json
    stst hello hello_empty.json
*/
hello(audience) ::= <<Hello $audience;null="is anyone there?"$!

>>
