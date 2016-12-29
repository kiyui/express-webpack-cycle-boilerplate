import xs from 'xstream'
import { div, p } from '@cycle/dom'

const HttpComponent = sources => {
  // Get fruit stream from HTTP events
  const fruit$ = sources.HTTP.select('fruits')
    .flatten()
    .map(res => res.body)
    .startWith({ err: false, fruits: [] }) // Start the stream with an empty expected response

  // Create a stream of HTTP requests for the HTTP driver
  const getFruit$ = xs.of(null).mapTo({
    url: '/v1/fruits',
    category: 'fruits'
  })

  // Create DOM based on fruit$ stream to be parsed by DOM driver
  const vdom$ = fruit$.map(data => {
    // Create a list of p() elements containing fruit data
    const fruitsDOM = data.fruits.map(fruit => p(fruit))
    // Return a div() containing the list of p()
    return div(fruitsDOM)
  })

  return {
    DOM: vdom$,
    HTTP: getFruit$
  }
}

export default HttpComponent
