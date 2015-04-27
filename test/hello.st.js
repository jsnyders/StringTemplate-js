/*
 * hand crafted template
 */

function getInstance(st, group) {
    "use strict";

    group.name = "hello";

    /*
     Template hello.st:
     hello(audience) ::= <%Hello $audience;null="is anyone there?",separator=", "$!$!this is the syntax for a comment inside a template!$
     %>
     */
    group.addTemplate("/hello", function (s, w, rc) {
        var g = this.owningGroup;
        w.write("Hello ");
        st.write(w, g, rc, s.audience, {"null": "is anyone there?", separator: ", "});
        w.write("!\n");
    }); // xxx need info about args, perhaps add as properties of the function

    return group;
}

module.exports = getInstance;
