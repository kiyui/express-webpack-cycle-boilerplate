import { div, p, input } from '@cycle/dom'

const HomeComponent = sources => {
  // Get events from .input-name as stream
  const name$ = sources.DOM.select('.input-name')
    .events('input')
    .map(event => event.target.value)
    .startWith('Input something into the field below') // Begin with an initial value for the stream

  const vdom$ = name$.map(data => div('.card .card-inverse .card-primary', [
    div('.card-block', [
      p('.card-text', data), // Assign value from input as text
      input('.form-control .input-name') // Take note of the .input-name class
    ])
  ]))

  return {
    DOM: vdom$
  }
}

export default HomeComponent
