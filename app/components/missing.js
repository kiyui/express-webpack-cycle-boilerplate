import xs from 'xstream'
import { div, p } from '@cycle/dom'

const MissingComponent = sources => {
  const vdom$ = xs.of({ err: true, message: 'Page not found' })
    .map(data => div([
      p(`${data.message}`)
    ]))

  return {
    DOM: vdom$
  }
}

export default MissingComponent
