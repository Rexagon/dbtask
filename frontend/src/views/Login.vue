<!-- TEMPLATE BEGIN -->
<template>
  <div class="auth-page">
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
      <b-form-row>
        <b-col align="center">
          <router-link to="signup">У меня нет аккаунта</router-link>
        </b-col>
      </b-form-row>
    </b-form>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ISignInData } from '@/models/user';
import state from '@/models/state';

@Component<LoginPage>({})
export default class LoginPage extends Vue {
  public data: ISignInData = { login: '', password: '' };

  public async signin() {
    try {
      await state.userManager.signIn(this.data);

      this.$router.push('/');
    } catch (err) {
      console.log('Wrong', err);
    }
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.auth-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    width: 300px;

    a {
      color: #6c757d;
      text-decoration: underline;

      &:hover {
        color: lighten(#6c757d, 10);
      }
    }
  }
}
</style>
<!-- STYLE END -->