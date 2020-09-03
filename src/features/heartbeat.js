export default {
  name: 'heartbeat',

  async render ({ onFrame }) {
    onFrame(() => {
      console.log('Cool')
    })
  }

}
