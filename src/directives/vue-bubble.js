export default {
  bind: (el, { arg, value = null }, vnode) => {
    vnode.componentInstance.$on(arg, (...args) => {
      vnode.context.$emit(value === null ? arg : value, ...args);
    });},
};