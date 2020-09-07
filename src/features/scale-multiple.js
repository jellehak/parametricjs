export default {
  name: 'scale',

  icon: `<svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
   <path d="m85.5 2.5h-55.898c-6.6016 0-12 5.3984-12 12v39.5h-6.5c-4.6992 0-8.6016 3.8008-8.6016 8.6016v26.301c0 4.6992 3.8008 8.6016 8.6016 8.6016h26.301c4.6992 0 8.6016-3.8008 8.6016-8.6016v-6.5h39.5c6.6016 0 12-5.3984 12-12l-0.003906-55.902c0-6.6016-5.3984-12-12-12zm5.1016 67.898c0 2.8008-2.3008 5.1992-5.1992 5.1992l-39.402 0.003906v-13c0-1.1016-0.19922-2.1992-0.60156-3.1016l27.402-27.5v12c0 1.8984 1.5 3.3984 3.3984 3.3984 1.8984 0 3.3984-1.5 3.3984-3.3984l0.003906-20.301c0-1.8984-1.5-3.3984-3.3984-3.3984h-20.203c-1.8984 0-3.3984 1.5-3.3984 3.3984 0 1.8984 1.5 3.3984 3.3984 3.3984l12 0.003906-27.5 27.5c-1-0.39844-2-0.60156-3.1016-0.60156h-12.898v-39.5c0-2.8008 2.3008-5.1992 5.1992-5.1992h55.801c2.8008 0 5.1992 2.3008 5.1992 5.1992v55.898z"/>
  </svg>
  `,

  props: {
    entities: {
      title: 'Entity',
      type: 'entity',
      // required: true
      default: () => ([])
    },
    factor: {
      title: 'Factor',
      type: 'number',
      default: 10
    }
  },

  render ({ THREE, getEntities } = {}, previousState) {
    // console.log(this.entities, previousState)
    const parsedEntities = getEntities(this.entities)

    console.log(parsedEntities)
    // NOTE: MUTATION
    parsedEntities.map(elem => {
      console.log(elem)
      elem.scale.set(this.factor, this.factor, this.factor)
    })

    return parsedEntities
  }
}
