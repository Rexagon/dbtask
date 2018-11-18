<!-- TEMPLATE BEGIN -->
<template>
  <div class="task">
    <b-input-group>
      <b-input type="text" autocomplete="off" v-model="newTitle" @keyup.enter.native="onSave" @keyup.escape.native="onBlur" v-on:blur.native="onBlur" ref="name" :disabled="processing"></b-input>
    </b-input-group>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import state from '@/models/state';
import { Task } from '@/models/task';

@Component
export default class CTaskForm extends Vue {
  // Properties //
  ///////////////

  private newTitle: string = '';
  private processing: boolean = false;

  // Methods //
  ////////////

  public async onSave() {
    if (this.processing || this.newTitle.length === 0) {
      return;
    }

    try {
      const task = new Task();
      task.title = this.newTitle;
      await state.taskManager.create(task);

      this.newTitle = '';
    } catch (err) {
      this.$notify({
        title: 'Невозможно создать задачу',
        duration: 1500,
        type: 'error'
      });
    }

    this.processing = false;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->