/*
 * hand crafted template
 */

function getInstance(st, group) {
    "use strict";

    group.name = "test";

    /*
     Template caller:
     main(arg1) ::= <%
         Greeting $sub(arg1.first, arg1.last)$
         Body
         $if(arg1.hasClosing)$
         Closing $arg1.closing$.
         $endif$
     %>
     */
    group.addTemplate("/main", function (w, rc) {
        var t, g = this.owningGroup,
            s = this.scope;
        w.write("Greeting ");
        // xxxst.write(w, g, rc, s.audience, {"null": "is anyone there?", separator: ", "});
        t = g.getTemplate("/sub", s);
        t.add("first", st.prop(g, s.arg1, "first")); // xxx should be positional
        t.add("last", st.prop(g, s.arg1, "last")); // xxx should be positional
        t.write(w, rc);
        w.write("\n");
        w.write("Body");
        w.write("\n");
        if (st.prop(g, s.arg1, "hasClosing")) {
            w.write("Closing ");
            st.write(w, g, rc, st.prop(g, s.arg1, "closing"));
        }
    }); // xxx need info about args, perhaps add as properties of the function

    /*
     Template sub:
     sub(first, last) ::= <%[$first$], [$last$]%>
     */
    group.addTemplate("/sub", function (w, rc) {
        var g = this.owningGroup,
            s = this.scope;
        w.write("[");
        st.write(w, g, rc, s.first);
        w.write("], [");
        st.write(w, g, rc, s.last);
        w.write("]");
    }); // xxx need info about args, perhaps add as properties of the function

    return group;
}

module.exports = getInstance;
