import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";
import Profile from "./views/Profile.vue";
import AdminPanel from "./views/AdminPanel.vue";
import ResetPassword from "./views/ResetPassword.vue";
import AdminCourses from "./views/admin/Courses";
import AdminSchedule from "./views/admin/Schedule";
import AdminReports from "./views/admin/Reports";
import AdminUsers from "./views/admin/Users";

Vue.use(Router);

export default new Router({
  mode: "history",
  linkExactActiveClass: "active",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        header: AppHeader,
        default: Landing,
        footer: AppFooter
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      }
    },
    {
      path: "/signup",
      name: "signup",
      components: {
        header: AppHeader,
        default: Signup,
        footer: AppFooter
      }
    },
    {
      path: "/password",
      name: "reset password",
      components: {
        header: AppHeader,
        default: ResetPassword,
        footer: AppFooter
      }
    },
    {
      path: "/profile/:id",
      name: "profile",
      components: {
        header: AppHeader,
        default: Profile,
        footer: AppFooter
      }
    },
    {
      path: "/admin-panel",
      name: "admin panel",
      components: {
        header: AppHeader,
        default: AdminPanel,
        footer: AppFooter
      },
      children: [
        {
          path: 'schedule',
          component: AdminSchedule
        },
        {
          path: 'reports',
          component: AdminReports
        },
        {
          path: 'users',
          component: AdminUsers
        },
        {
          path: 'courses',
          component: AdminCourses
        }
      ]
    },
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
