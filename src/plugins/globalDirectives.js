import clickOutside from "../directives/click-ouside.js";
import vueBubble from "../directives/vue-bubble"

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(Vue) {
    Vue.directive("click-outside", clickOutside);
    Vue.directive("bubble", vueBubble)
  }
};

export default GlobalDirectives;
