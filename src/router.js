import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Landing from "./views/Landing";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ResetPassword from "./views/ResetPassword";
import Profile from "./views/Profile";
import AdminPanel from "./views/admin/AdminPanel";
import CourseList from "./views/admin/Course/CourseList";
import Schedule from "./views/admin/Schedule/Schedule";
import ReportList from "./views/admin/Report/ReportList";
import ReportForm from "./views/admin/Report/ReportForm";
import UserList from "./views/admin/User/UserList";
import HourList from "./views/admin/Hour/HourList";
import FAQIndex from "./views/FAQ/FAQIndex";
import FAQQuestionView from "./views/FAQ/FAQQuestionView";
import FAQAsk from "./views/FAQ/FAQAsk";
import TutorQuestion from "./views/admin/Questions/TutorQuestion";
import QuestionSummaries from "./views/admin/Questions/QuestionSummaries";
import UsefulResourcesView from "./views/UsefulResourcesView";
import AdminSchedule from "./views/admin/Schedule/AdminSchedule";
import UsefulResourcesAdmin from "./views/admin/UsefulResourcesAdmin";

let router = new Router({
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
      },
      meta: {
        lightHeader: true
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      },
      props: {
        default: true
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
      path: "/profile",
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
          path: "schedule",
          component: AdminSchedule
        },
        {
          path: "reports",
          component: ReportList
        },
        {
          path: "report/:id",
          component: ReportForm
        },
        {
          path: "users",
          component: UserList
        },
        {
          path: "courses",
          component: CourseList
        },
        {
          path: "hours",
          component: HourList
        },
        {
          path: "questions",
          component: TutorQuestion
        },
        {
          path: "question_summaries",
          component: QuestionSummaries
        },
        {
          path: "useful_resources",
          component: UsefulResourcesAdmin
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/faq",
      name: "faq_index",
      components: {
        header: AppHeader,
        default: FAQIndex,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/faq/ask",
      name: "faq_ask",
      components: {
        header: AppHeader,
        default: FAQAsk,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/faq/:id",
      name: "faq_detail",
      components: {
        header: AppHeader,
        default: FAQQuestionView,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/useful_resources/:course_id",
      name: "useful_resources",
      components: {
        header: AppHeader,
        default: UsefulResourcesView,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (router.app.$store.state.signedIn) {
      next();
    } else {
      if (window.$cookies.get("jwt")) {
        //TODO Check if this is still needed or if its handled sufficiently by main.js
        let token = window.$cookies.get("jwt");
        let userId = window.$cookies.get("userId");
        let userRole = window.$cookies.get("userRole");
        router.app.$store.commit("SIGNED_IN", [token, userId, userRole]);
        next();
      } else {
        next({
          name: "login",
          params: { nextUrl: to.fullPath }
        });
      }
    }
  } else {
    next();
  }
});

export default router;
