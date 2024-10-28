import { kernel }from "./components/kernel";

window.kernel = kernel
kernel.init()
window.kernel.user = "user"
if (window.intilizated == true){
    window.kernel.gui("../components/Main")
} else {
    console.log("kernel init - failed");
}
