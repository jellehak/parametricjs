const {Vuex} = window

export const store = new Vuex.Store({
  state: {
    selected: {},
    hightlighted: {}
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
