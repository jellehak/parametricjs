//Import components
//import layout from "./layouts/complex.vue"
//import googleKeep from "./layouts/googleKeep.vue"
import layoutComplex from "./layouts/complex.js"
import layoutHello from "./layouts/hello.js"

Vue.component('layout', layoutComplex)

const NotFound = { template: '<p>Page not found</p>' }
const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }

const routes = {
    '/': Home,
    '/about': About
}

new Vue({
    el: '#app',
    // data: {
    //     currentRoute: window.location.pathname
    // },
    // computed: {
    //     ViewComponent() {
    //         return routes[this.currentRoute] || NotFound
    //     }
    // },
    // render(h) { return h(this.ViewComponent) }
})