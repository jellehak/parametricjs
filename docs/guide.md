
# Feature
The magic of this library that it makes it easy to create a `feature`. A feature is defined in a syntax that is quite similar to `Vue`.
A minimal features looks something like this:
```js
export default {
  name: 'box',

  props: {
    size: {
      type: 'number',
      default: 10
    },
    color: {
      type: 'color',
      default: 'blue'
    }
  },

  render ({ THREE } = {}) {
    var geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
    var material = new THREE.MeshBasicMaterial({ color: this.color })
    var cube = new THREE.Mesh(geometry, material)
    return cube
  }
}
```

> Context is provided to easily get access to certain parts of the library. The library is created on top of `THREE`. This will probably be the first `context` you will use in creating a custom feature. 

# Types
To create a feature you can control the input with `props`. A prop definition looks like this:

```js
props: {
    entities: {
        title: 'Entities',
        type: 'entities',
        required: true
    },
    distance: {
        title: 'Distance',
        type: 'number',
        default: 1
    },
    material: {
        title: 'Material',
        type: 'material',
        default: 'blue'
    }
},
```
> Note: types will be converted to lowercase so `Number` will also work for `number`


## string
## color
## path
Picker for only closed paths
## line
Picker for only lines
## mesh
Picker for a mesh
## entity
Will give back a single entity
## entities
Multiple `entity`
## material

# Lifecycle

## render
The render function is used to create the `mesh`.

## destroy
```js
export default {
  name: 'lifecycle',

  async render ({ destroy, addEventListener, getMouse }) {
    const handleClick = (e) => {
      console.log(getMouse())
      console.log('click', e)
    }

    // # Events
    addEventListener('click', handleClick)

    destroy(() => {
      console.log('Bye bye')
      removeEventListener('click', handleClick)
    })
  }
}
```