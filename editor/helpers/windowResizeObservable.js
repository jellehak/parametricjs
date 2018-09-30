import { Observable } from '../../editor/lib/Observable'

var resize = new Observable((o) => {
  // function to handle resize event
  // and forward through observable
  function onResize () {
    var height = window.innerHeight
    var width = window.innerWidth
    o.next({height, width})
  }

  // listen for window resize and pass height and width
  window.addEventListener('resize', onResize)

  // return a function that will clean up the handler
  return () => {
    window.removeEventListener('resize', onResize)
  }
})
