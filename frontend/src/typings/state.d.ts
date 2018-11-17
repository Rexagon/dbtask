declare module 'state' {
  import { State } from '@/models/state';

  module 'vue/types/vue' {
    interface Vue {
      $state: State;
    }
  }
}
