<!-- TEMPLATE BEGIN -->
<template>
  <div class="task" v-if="isVisible">
    <b-input-group>
      <b-input type="text" autocomplete="off" v-model="newTitle" @keyup.enter.native="onSave" @keyup.escape.native="onBlur" v-on:blur.native="onBlur" ref="title" :disabled="processing"></b-input>
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

  private columnId?: number;
  private newTitle: string = '';
  private isVisible: boolean = false;
  private processing: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$on('show', (columnId?: number) => {
      this.isVisible = true;
      this.columnId = columnId;

      this.$nextTick(() => {
        const el = (this.$refs.title as Vue).$el;
        const input = el as HTMLInputElement;

        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      });
    });
  }

  // Methods //
  ////////////

  public async onSave() {
    if (this.processing || this.newTitle.length === 0) {
      return;
    }

    try {
      const task = new Task();
      task.title = this.newTitle;
      task.columnId = this.columnId;
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

  public async onBlur() {
    if (this.processing) {
      return;
    }

    this.isVisible = false;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->