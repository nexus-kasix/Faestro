import { render } from "solid-js/web";
import { lazy } from "solid-js"; 
export const kernel = {
    rootuser: "root",
    user: "user",
    shurl: "../commands/console.js",
    init: function() {
        let users = {
            root: "root",
            user: "",
        }
        const intilizated = true;
        window.kernel.users = users
        window.intilizated = intilizated
        console.log("Kernel intilizated");
    },
    restart: function() {
        location.reload();
    },
    runing: function() {
        console.log("kernel step")
    },
    chuser: function(user, password) {
        if (window.kernel.users[user] == password && window.kernel.users[user]) {
            window.kernel.user = user
        }
    },
    gui: function(file) {
        document.getElementById("root").innerHTML = "";
        const Main = lazy(() => import(file)); 
        render(() => <Main />, document.getElementById("root"));
    },
    BSOD: function(error) {
        document.getElementById("root").innerHTML = "<h1>Fatal error: " + error + "<\h1>";
    },
};
// const faestroapi = function(api, ...args) {
//     if (api == "chuser") {
//       account = args //[1]
//     }
//   }