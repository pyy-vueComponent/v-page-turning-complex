import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Project from '@/components/Project'
import Investor from '@/components/Investor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/project',
      redirect: '/project/library/1',
      name: 'Project',
      component: Project,
      children: [{
      	path: 'library/:page',
      	component: Project,
      }]
    },
    {
      path: '/investor',
      redirect: '/investor/library/1',
      name: 'Investor',
      component: Investor,
      children: [{
        path: 'library/:page',
        component: Investor,
      }]
    }
  ]
})