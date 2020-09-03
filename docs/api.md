Read here all how to interact with this library.

# Events
```js
parametric.on('click:intersect', (obj) => {
  console.log('Clicked on', obj)
})
parametric.on('hover', (obj) => {
  console.log('Hover over', obj)
})

parametric.on('beforeRender', (obj) => {
  console.log('beforeRender')
})
parametric.on('render', (obj) => {
  console.log('render')
})
parametric.on('afterRender', (obj) => {
  console.log('afterRender')
})
```