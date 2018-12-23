<!-- TEMPLATE BEGIN -->
<template>
  <div class="auth-page">
    <b-form>
      <b-form-group>
        <b-form-input placeholder="Логин" v-model.trim="data.login" autocomplete="username"></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input
          placeholder="Пароль"
          type="password"
          v-model="data.password"
          autocomplete="new-password"
        ></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input placeholder="Имя" v-model="data.firstName" autocomplete="given-name"></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input placeholder="Фамилия" v-model="data.lastName" autocomplete="family-name"></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-button style="width: 100%" @click="signup">Регистрация</b-button>
      </b-form-group>
      <b-form-row>
        <b-col align="center">
          <router-link to="signin">У меня уже есть аккаунт</router-link>
        </b-col>
      </b-form-row>
    </b-form>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ISignUpData } from '@/models/user';
import state from '@/models/state';

@Component<RegistrationPage>({})
export default class RegistrationPage extends Vue {
  public data: ISignUpData = {
    login: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  public async signup() {
    try {
      await state.userManager.signUp(this.data);

      this.$notify({
        title: 'Пользователь успешно создан',
        duration: 1000
      });

      this.$router.push('/');
    } catch (err) {
      this.$notify({
        title: 'Невозможно создать пользователя',
        duration: 1500,
        type: 'error'
      });
    }
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->