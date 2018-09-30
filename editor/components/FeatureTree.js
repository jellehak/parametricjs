const {Vue} = window

// demo data
var data = {
  name: 'Features',
  children: [
    { name: 'Sketch 1' },
    { name: 'Extrude' }
    // {
    //   name: 'child folder',
    //   children: [
    //     {
    //       name: 'child folder',
    //       children: [
    //         { name: 'hello' },
    //         { name: 'wat' }
    //       ]
    //     },
    //     { name: 'hello' },
    //     { name: 'wat' },
    //     {
    //       name: 'child folder',
    //       children: [
    //         { name: 'hello' },
    //         { name: 'wat' }
    //       ]
    //     }
    //   ]
    // }
  ]
}

// define the item component
Vue.component('item', {
  template: `<li class='list__tile__content'>
  <div
    :class="{bold: isFolder}"
    @click="toggle"
    @dblclick="changeType">
    <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    {{ model.name }}
  </div>
  <ul v-show="open" v-if="isFolder">
    <item
      class="item"
      v-for="(model, index) in model.children"
      :key="index"
      :model="model">
    </item>
    <li class="add" @click="addChild">+</li>
  </ul>
</li>`,
  props: {
    model: Object
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    isFolder () {
      return this.model.children &&
          this.model.children.length
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    changeType () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.open = true
      }
    },
    addChild () {
      this.model.children.push({
        name: 'new stuff'
      })
    }
  }
})

Vue.component('featuretree', {
  data: () => ({
    treeData: data
  }),
  template: `
    <ul id="demo">
    <item
      class="item"
      :model="treeData">
    </item>
  </ul>
    `
})

// <p>(You can double click on an item to turn it into a folder.)</p>

// <!-- the demo root element -->
