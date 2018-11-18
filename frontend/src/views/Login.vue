<!-- TEMPLATE BEGIN -->
<template>
  <div class="login-page">
    <b-form>
      <b-form-group>
        <b-form-input type="text" v-model.trim="data.login"></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input type="password" v-model="data.password"></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-button style="width: 100%" @click="signin">Войти</b-button>
      </b-form-group>
    </b-form>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ISignInData } from '@/models/user';
import state from '@/models/state';

@Component
export default class LoginPage extends Vue {
  public data: ISignInData = { login: '', password: '' };

  public async signin() {
    try {
      await state.userManager.signIn(this.data);

      this.$router.push('/');
    } catch (err) {
      console.log('Wrong');
    }
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    width: 300px;
  }
}
</style>
<!-- STYLE END -->