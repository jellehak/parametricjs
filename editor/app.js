// import { timeoutPromise } from './helpers/timeoutPromise.js'
import { store } from './store/index.js'

// Register components
import './components/Viewer/viewer.js'
import './components/modelSelector.js'
import './components/FeatureTree.js'

const {Vue} = window
// const {Vuex} = window
// Vue.use(Vuex)

window.vue = new Vue({
  el: '#app',
  store
})
