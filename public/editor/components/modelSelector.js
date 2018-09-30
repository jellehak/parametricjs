const {Vue} = window

const models = [
  {name: 'bore', url: ''},
  {name: 'box', url: ''},
  {name: 'cut', url: ''},
  {name: 'foil', url: ''},
  {name: 'heart', url: ''},
  {name: 'I', url: ''},
  {name: 'pattern', url: ''},
  {name: 'planes', url: ''},
  {name: 'simple', url: ''},
  {name: 'sketch', url: ''}
]

const component = {
  data: () => ({
    models,
    model: {}
  }),
  template: `<div>
  Select model: 
  <select v-model="model">
  <option v-for="item in models" :id='item.name' >{{item.name}}</option>
  </select></div>`,
  watch: {
    model () {
      console.log('Model change', this.model)
    }
  }
}

Vue.component('model-selector', component)
