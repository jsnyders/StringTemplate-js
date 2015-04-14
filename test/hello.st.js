/*
 * hand crafted template
 */

function getInstance(st, group) {
    "use strict";

    /*
     Template hello.st:
     hello(audience) ::= <%Hello $audience;null="is anyone there?"$!$!this is the syntax for a comment inside a template!$
     %>
     */
    group.addTemplate("hello", function (c, w) {
        w.write("Hello ");
        st.write(w, c.audience, {"null": "is anyone there?"});
        w.write("!\n");
    }); // xxx need info about args, perhaps add as properties of the function

    return group;
}

module.exports = getInstance;
