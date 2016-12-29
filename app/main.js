import xs from 'xstream'
import switchPath from 'switch-path'
import Cycle from '@cycle/xstream-run'
import { makeHTTPDriver } from '@cycle/http'
import { makeRouterDriver } from 'cyclic-router'
import { div, nav, h1, a, ul, li, makeDOMDriver } from '@cycle/dom'
import { createHistory } from 'history'

// Components
import HomeComponent from './components/home'
import HttpComponent from './components/http'
import MissingComponent from './components/missing'
require('./main.scss')

// Webpack hot reload plugin
if (module.hot) {
  module.hot.accept()
}

const main = sources => {
  const match$ = sources.router.define({
    '/': HomeComponent,
    '/http': HttpComponent,
    '*': MissingComponent
  })

  const page$ = match$.map(({path, value}) => value(Object.assign({}, sources, {
    router: sources.router.path(path)
  })))

  // Get sinks from all components
  const view$ = page$.map(v => v.DOM || xs.never()).flatten()
  const http$ = page$.map(v => v.HTTP || xs.never()).flatten()
  const route$ = page$.map(v => v.router || xs.never()).flatten()

  // Create a main page

  // Navigation bar
  const nav$ = xs.of(nav('.navbar .navbar-fixed-top .navbar-dark .bg-inverse', [
    h1('.navbar-brand', 'express-webpack-cycle-boilerplate'),
    ul('.nav .navbar-nav', [
      li('.nav-item', [a('.home .nav-link', { href: '#' }, 'Home')]),
      li('.nav-item', [a('.http .nav-link', { href: '#' }, 'Http Example')])
    ])
  ]))

  const navHomeClick$ = sources.DOM.select('.home').events('click')
  const navHttpClick$ = sources.DOM.select('.http').events('click')

  // Wrap component DOM inside a main container DOM
  const vdom$ = xs.combine(nav$, view$).map(([navDOM, viewDOM]) => {
    // Main view container
    const bodyDOM = div('.container .mt-2', [viewDOM])
    return div([navDOM, bodyDOM])
  })

  // Create router sink
  const router$ = xs.merge(
    navHomeClick$.mapTo('/'),
    navHttpClick$.mapTo('/http'),
    route$
  )

  const sinks = {
    DOM: vdom$,
    HTTP: http$,
    router: router$
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app-container'),
  HTTP: makeHTTPDriver(),
  router: makeRouterDriver(createHistory(), switchPath)
}

Cycle.run(main, drivers)
