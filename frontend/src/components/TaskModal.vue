<!-- TEMPLATE BEGIN -->
<template>
  <div class="task-modal">
    <b-modal
      v-model="isVisible"
      size="lg"
    >
      <template slot="modal-title">
        Задание
      </template>

      <b-form>
        <b-form-group label="Название">
          <b-form-input v-model="data.title" />
        </b-form-group>
        <b-form-group label="Описание">
          <b-form-textarea
            v-autosize="data.description"
            v-model="data.description"
            ref="description"
          >
          </b-form-textarea>
        </b-form-group>
        <b-form-group label="Колонка">
          <b-form-select
            v-model="data.columnId"
            :options="columnOptions"
          />
        </b-form-group>
        <b-form-group label="Ответственные">
          <div
            v-for="user in data.assignedUsers"
            :key="user.id"
          >{{ user.login }}</div>
        </b-form-group>
      </b-form>

      <template slot="modal-footer">
        <b-button
          variant="outline-danger"
          @click="deleteTask"
          :disabled="processing"
        >Удалить</b-button>
        <b-button
          variant="secondary"
          @click="isVisible = false"
          :disabled="processing"
        >Отмена</b-button>
        <b-button
          variant="primary"
          :disabled="processing"
          @click="save"
        >Сохранить</b-button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEIGN -->
<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
import { Task, ITaskData } from '@/models/task';
import state from '@/models/state';

import CTaskUser from '@/components/TaskModal.vue';

import autosize from 'autosize';
import { Column } from '@/models/column';
import Bus from '@/bus';
import { IUserData } from '@/models/user';

@Component({
  components: {
    CTaskUser
  }
})
export default class TaskModal extends Vue {
  // Properties //
  ///////////////

  private data: ITaskData = new Task();
  private processing: boolean = false;
  private isVisible: boolean = false;
  private columnOptions: Array<{ value?: number; text: string }> = [];

  // Component methods //
  //////////////////////

  @Watch('task', {
    immediate: true
  })
  public onTaskChanged(task?: Task) {
    if (task) {
      this.data = Object.assign({}, task);
    } else {
      this.data = new Task();
    }
  }

  public mounted() {
    this.syncColumns();
    Bus.on('columns-changed', (columns: Column[]) => {
      this.syncColumns();
    });

    this.$on('lock', (lock: boolean) => {
      this.processing = lock;
    });

    this.$on('show', (task?: ITaskData) => {
      this.data = Object.assign({}, task) || new Task();
      autosize((this.$refs.description as Vue).$el);
      this.isVisible = true;
    });
  }

  // Methods //
  ////////////

  public async save() {
    if (this.processing) {
      return;
    }

    this.processing = true;

    try {
      await state.taskManager.update(this.data);

      this.$notify({
        title: 'Задача сохранена',
        duration: 1500
      });
    } catch (err) {
      this.$notify({
        title: 'Невозможно сохранить задачу',
        duration: 1500,
        type: 'error'
      });
    }

    this.processing = false;
  }

  public async deleteTask() {
    if (this.processing || !confirm('Вы действительно хотите удалить задачу?')) {
      return;
    }

    this.processing = true;

    try {
      await state.taskManager.delete(this.data.id);

      this.$notify({
        title: 'Задача удалена',
        duration: 1500
      });
    } catch (err) {
      this.$notify({
        title: 'Невозможно удалить задачу',
        duration: 1500,
        type: 'error'
      });
    }

    this.processing = false;
  }

  public syncColumns() {
    this.columnOptions = [{ text: 'Архив' }].concat(
      state.columnManager.columns.map((column) => ({
        value: column.id,
        text: column.name
      }))
    );
  }

  public syncTask() {
    const currentTask = state.taskManager.tasks.find(
      (task) => task.id === this.data.id
    );
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.task-modal {
  textarea {
    resize: none;
    @include no-scrollbar();
  }

  footer {
    display: flex;
    flex-direction: row;

    button {
      &:first-child {
        margin-right: auto;
      }
    }
  }
}
</style>
<!-- STYLE END -->
