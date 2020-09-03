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
