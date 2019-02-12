import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Landing from "./views/Landing";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ResetPassword from "./views/ResetPassword";
import Profile from "./views/Profile";
import AdminPanel from "./views/AdminPanel";
import CourseList from "./views/admin/Course/CourseList";
import Schedule from "./views/admin/Schedule/Schedule";
import ReportList from "./views/admin/Report/ReportList";
import UserList from "./views/admin/User/UserList";
import HourList from "./views/admin/Hour/HourList";

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
          component: Schedule
        },
        {
          path: 'reports',
          component: ReportList
        },
        {
          path: 'users',
          component: UserList
        },
        {
          path: 'courses',
          component: CourseList
        },
        {
          path: 'hours',
          component: HourList
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
