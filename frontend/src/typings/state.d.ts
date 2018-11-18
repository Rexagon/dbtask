declare module 'state' {
  module 'vue/types/vue' {
    interface Vue {
      $bus: Vue;
    }
  }
}
