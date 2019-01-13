<!-- TEMPLATE BEGIN -->
<template>
  <div class="task" v-bind:class="{'my-task': isMy}" @click="showModal">
    <div class="wrapper">
      <div class="title">{{ task.title }}</div>
      <div>
        <icon name="align-left" style="position: relative; top: -2px" v-if="hasDescription"/>
      </div>
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

  get isMy() {
    const currentUser = state.userManager.currentUser;

    return (
      this.task.assignedUsers &&
      this.task.assignedUsers.includes(currentUser ? currentUser.id : 0)
    );
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.task {
  background-color: #444444;
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background-color: #555555;
  }

  .wrapper {
    padding: 5px 10px;
  }

  &.my-task .wrapper {
    box-shadow: inset -2px 0px 0px 0px var(--warning);
  }
}
</style>
<!-- STYLE END -->