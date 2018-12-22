<!-- TEMPLATE BEGIN -->
<template>
  <div class="task" @click="showModal">
    <div>{{ task.title }}</div>
    <div>
      <icon name="align-left" style="position: relative; top: -2px" v-if="hasDescription"/>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Icon from 'vue-awesome/components/Icon';
import CTaskModal from '@/components/TaskModal.vue';

import 'vue-awesome/icons/align-left';

import { Task } from '@/models/task';
import state from '@/models/state';

@Component({
  components: {
    Icon
  }
})
export default class CTask extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public task!: Task;

  // Methods //
  ////////////

  public showModal() {
    state.notify('show-task-modal', this.task);
  }

  // Computed //
  /////////////

  get hasDescription() {
    return this.task.description && this.task.description.length > 0;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.task {
  padding: 5px 10px;
  background-color: #444444;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background-color: #555555;
  }
}
</style>
<!-- STYLE END -->