<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <b-row>
      <b-col></b-col>
      <b-col>
        <b-row>
          <b-col
            v-for="user in users"
            :key="`user-${user.id}`"
          >{{ user.firstName }} {{ user.lastName }}</b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { User } from '@/models/user';
import state from '@/models/state';

@Component
export default class ProfilePage extends Vue {
  // Properties //
  ///////////////

  private users: User[] = [];

  // Component methods //
  //////////////////////

  public async created() {
    this.syncUsers();
    this.$subscribeTo(state.userManager.eventBus, () => {
      this.syncUsers();
    });
  }

  public async mounted() {
    state.userManager.fetchAll();
  }

  // Methods //
  ////////////

  private syncUsers() {
    const currentUser = state.userManager.currentUser;

    this.users = state.userManager.users.filter(
      (user) => currentUser == null || user.id !== currentUser.id
    );
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.profile-page {
  width: calc(100% - #{$sidebar-width});
}
</style>
<!-- STYLE END -->