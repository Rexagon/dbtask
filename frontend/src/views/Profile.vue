<!-- TEMPLATE BEGIN -->
<template>
  <div class="profile-page">
    <b-row class="mt-4">
      <b-col cols="12" md="6">
        <b-form v-if="user">
          <h3>@{{user.login}}</h3>
          <hr>
          <b-form-group label="Имя">
            <b-form-input v-model="user.firstName"/>
          </b-form-group>
          <b-form-group label="Фамилия">
            <b-form-input v-model="user.lastName"/>
          </b-form-group>
          <b-form-group>
            <b-button variant="primary" :disabled="processing" @click="save">Сохранить</b-button>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col cols="12" md="6">
        <h3>Пользователи</h3>
        <hr>
        <b-card-group deck class="mb-3">
          <b-card
            v-for="user in users"
            :key="`user-${user.id}`"
            v-bind:class="{'is-my': isMy(user.id)}"
          >
            <h3>@{{user.login}}</h3>
            {{ user.firstName }} {{ user.lastName }}
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { User, IUserData } from '@/models/user';
import state from '@/models/state';

@Component
export default class ProfilePage extends Vue {
  // Properties //
  ///////////////

  private processing: boolean = false;
  private user: IUserData | null = null;

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
    await state.userManager.fetchAll();

    this.restoreCurrentUser();
  }

  // Methods //
  ////////////

  private async save() {
    if (this.processing || this.user == null) {
      return;
    }

    this.processing = true;

    try {
      await state.userManager.update(this.user);

      this.restoreCurrentUser();

      this.$notify({
        title: 'Изменения успешно сохранены',
        duration: 1000
      });
    } catch (e) {
      this.$notify({
        title: 'Невозможно сохранить изменения',
        duration: 1500,
        type: 'error'
      });
    }

    this.processing = false;
  }

  private restoreCurrentUser() {
    this.user = Object.assign({}, state.userManager.currentUser);
  }

  private syncUsers() {
    this.users = state.userManager.users;
  }

  private isMy(id: number) {
    const currentUser = state.userManager.currentUser;
    return currentUser != null && currentUser.id === id;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.profile-page {
  padding: 1em;
  width: calc(100% - #{$sidebar-width});

  .is-my {
    box-shadow: inset -2px 0px 0px 0px var(--warning);
  }
}
</style>
<!-- STYLE END -->