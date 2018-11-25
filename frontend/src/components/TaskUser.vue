<!-- TEMPLATE BEGIN -->
<template>
  <div class="task-user">

  </div>
</template>
<!-- TEMPLATE END -->

<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User } from '@/models/user';

@Component
export default class CTaskUser extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public taskId!: number;

  @Prop()
  public user!: User;

  // Methods //
  ////////////

  public remove() {
    
  }
}
</script>
<!-- SCRIPT END -->

<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->