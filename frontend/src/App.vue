<!-- TEMPLATE BEGIN -->
<template>
  <div id="app" :class="{ 'no-sidebar': noSidebar }">
    <notifications position="bottom right"></notifications>
    <div class="sidebar" v-if="!noSidebar">
      <router-link to="/" :class="{ active: checkActiveSection('home') }">
        <icon name="tasks" scale="2"></icon>
      </router-link>
      <router-link to="/profile" :class="{ active: checkActiveSection('profile') }">
        <icon name="user-edit" scale="2"></icon>
      </router-link>
      <a @click="signOut">
        <icon name="sign-out-alt" scale="2"></icon>
      </a>
    </div>
    <div class="main-area">
      <router-view/>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->

<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';

import 'vue-awesome/icons/tasks';
import 'vue-awesome/icons/user-edit';
import 'vue-awesome/icons/sign-out-alt';

import state from '@/models/state';

@Component<App>({
  components: {
    Icon
  }
})
export default class App extends Vue {
  // Methods //
  ////////////

  public checkActiveSection(name: string) {
    return this.$route.name === name;
  }

  public signOut() {
    state.userManager.signOut();
    this.$router.push({ name: 'signin' });
  }

  get noSidebar(): boolean {
    return (
      this.$route.name == null ||
      ['signin', 'signup'].includes(this.$route.name)
    );
  }
}
</script>
<!-- SCRIPT END -->

<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

html,
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #1e1e1e !important;
  color: #acacac !important;
  height: 100%;
}

#app {
  height: 100%;

  .sidebar {
    width: $sidebar-width;
    height: 100vh;
    position: fixed;

    background-color: #252525;
    display: flex;
    flex-direction: column;
    padding-top: 10px;

    a {
      width: 100%;
      padding: 10px 0px;

      text-decoration: none;
      text-align: center;

      color: #acacac;

      &.active {
        color: #ffffff;
        background-color: #1e1e1e;
      }

      &:hover {
        color: #ffffff;
      }

      &:last-child {
        margin-top: auto;
        color: #8d4841 !important;
        cursor: pointer;

        &:hover {
          color: #db3725 !important;
        }
      }
    }
  }

  .main-area {
    height: 100vh;
    margin-left: $sidebar-width;
  }

  &.no-sidebar {
    .main-area {
      margin-left: 0;
    }
  }
}
</style>
<!-- STYLE END -->
