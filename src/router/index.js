import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

Vue.filter('toCurrency', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
  return formatter.format(value)
})
import { date } from 'quasar'
Vue.filter('formatDate', function (value) {
  let splitDate = value.split('-')
  let endDate = new Date(splitDate[0], splitDate[1] - 1, splitDate[2])
  if (value) {
    return date.formatDate(endDate, 'DD/MM/YYYY')
  }
})

/*
 * If not building with SSR mode, you ca
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
