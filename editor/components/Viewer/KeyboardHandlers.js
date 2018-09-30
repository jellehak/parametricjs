export const KeyboardHandlers = ({scene}) => {
  const keyHandlers = [
    {
      key: 'h',
      description: 'Toggle mesh visibility',
      handler: () => {
        scene.children.map((elem) => { elem.visible = !elem.visible })
      }
    },
    {
      key: 'e',
      description: 'Extrude current selection',
      handler: () => {

      }
    }
  ]

  document.addEventListener('keypress', ({ key }) => {
    const handler = keyHandlers.filter(elem => elem.key === key)[0]
    if (handler) {
      console.log(`Calling: ${handler.description}`)
      handler.handler()
    }
  })

  // On EnterFrame
  // add({
  //   render: ({ keyboard }) => {
  //     if (keyboard.pressed('shift+A')) {
  //       console.log('Help')
  //     }
  //   }
  // })
}
