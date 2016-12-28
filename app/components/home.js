import xs from 'xstream'
import { div, p } from '@cycle/dom'

const HomeComponent = sources => {
  const vdom$ = xs.of({ err: false, message: 'Home page' })
    .map(data => div([
      p(`${data.message}`)
    ]))

  return {
    DOM: vdom$
  }
}

export default HomeComponent
