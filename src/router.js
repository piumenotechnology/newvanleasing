import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from "./utils/auth.guard";
import { adminRoot } from "./constants/config";
import { UserRole } from "./utils/auth.roles";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "./views/home"),
    redirect: "login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "home" */ "./views/home/Login")
      }
    ]
  },
  {
    path: adminRoot,
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: `${adminRoot}/vehicles`,
    meta: { loginRequired: true },
    /*
   define with Authorizaddation :
   meta: { loginRequired: true, roles: [UserRole.Admin, UserRole.Editor] },
   */
    children: [
      {
        path: "dashboard",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "./views/app/dashboard")
      },
      {
        path: "vehicles",
        component: () =>
          import(/* webpackChunkName: "vehicles" */ "./views/app/vehicles"),
        redirect: `${adminRoot}/vehicles/all-vehicles`,
        children: [
          {
            path: 'all-vehicles', component: () => import(/* webpackChunkName: "vehicles" */ './views/app/vehicles/AllVehicles')
          },
          {
            path: 'available-stock', component: () => import(/* webpackChunkName: "vehicles" */ './views/app/vehicles/AvailableStock')
          },
          {
            path: 'potential-stock', component: () => import(/* webpackChunkName: "vehicles" */ './views/app/vehicles/PotentialStock')
          },
          {
            path: 'booked-stock', component: () => import(/* webpackChunkName: "vehicles" */ './views/app/vehicles/BookedStock')
          },
          {
            path: ':id', component: () => import(/* webpackChunkName: "vehicles" */ './views/app/vehicles/VehicleDetail')
          },
        ]
      },
      {
        path: "contracts",
        component: () =>
          import(/* webpackChunkName: "contracts" */ "./views/app/contracts"),
        redirect: `${adminRoot}/contracts/all-contracts`,
        children: [
          {
            path: 'all-contracts', component: () => import(/* webpackChunkName: "contracts" */ './views/app/contracts/AllContracts')
          },
          {
            path: 'active-contracts', component: () => import(/* webpackChunkName: "contracts" */ './views/app/contracts/ActiveContracts')
          },
          {
            path: ':id', component: () => import(/* webpackChunkName: "contracts" */ './views/app/contracts/ContractDetail')
          }
        ]
      },
      {
        path: "end-contracts",
        component: () =>
          import(/* webpackChunkName: "end-contracts" */ "./views/app/contracts/EndContracts")
      },
      {
        path: "additional",
        component: () =>
          import(/* webpackChunkName: "additional" */ "./views/app/additional/Additional"),
        meta: { loginRequired: true, roles: [UserRole.Admin] }
      },
      {
        path: "performance",
        component: () =>
          import(/* webpackChunkName: "performance" */ "./views/app/performance"),
        redirect: `${adminRoot}/performance/all`,
        meta: { loginRequired: true, roles: [UserRole.Admin] },
        children: [
          {
            path: 'all', component: () => import(/* webpackChunkName: "contracts" */ './views/app/performance/VehiclePerformance')
          },
          {
            path: ':id', component: () => import(/* webpackChunkName: "performance" */ './views/app/performance/PerformanceDetail')
          }
        ]
      },
      // {
      //   path: "single",
      //   component: () =>
      //     import(/* webpackChunkName: "single" */ "./views/app/single")
      // }
    ]
  },
  {
    path: "/unauthorized",
    component: () => import(/* webpackChunkName: "unauthorized" */ "./views/Unauthorized")
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history",
});
router.beforeEach(AuthGuard);
export default router;
