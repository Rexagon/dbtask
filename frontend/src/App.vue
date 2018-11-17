<!-- TEMPLATE BEGIN -->
<template>
  <div id="app">
    <div class="sidebar">
      <a href="/" :class="{active: checkActiveSection('home')}">
        <icon name="tasks" scale="2"></icon>
      </a>
      <a href="/users">
        <icon name="user-edit" scale="2"></icon>
      </a>
      <a style="color: #8D4841">
        <icon name="sign-out-alt" scale="2"></icon>
      </a>
    </div>
    <div class="main-area">
      <router-view />
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

@Component({
  components: {
    Icon
  }
})
export default class App extends Vue {
  public checkActiveSection(name: string) {
    return this.$route.name === name;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
$sidebar-width: 64px;

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
}

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
    }
  }
}

.main-area {
  height: 100vh;
  margin-left: $sidebar-width;
  overflow-x: auto;
}
</style>
<!-- TEMPLATE END -->