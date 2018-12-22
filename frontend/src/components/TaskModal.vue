<!-- TEMPLATE BEGIN -->
<template>
  <div class="task-modal">
    <b-modal v-model="isVisible" size="lg">
      <template slot="modal-title">Задание</template>

      <b-form @submit.prevent="save">
        <b-form-group label="Название">
          <b-form-input v-model="data.title"/>
        </b-form-group>
        <b-form-group label="Описание">
          <b-form-textarea
            v-autosize="data.description"
            v-model="data.description"
            ref="description"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Колонка">
          <b-form-select v-model="data.columnId" :options="columnOptions"/>
        </b-form-group>
        <b-form-group label="Ответственные">
          <div class="users-list">
            <div
              v-b-tooltip.hover
              :title="`${user.firstName} ${user.lastName}`"
              v-for="user in data.assignedUsers"
              :key="user.id"
            >@{{ user.login }}</div>
          </div>
          <b-form-select style="width: 200px" v-model="data.users" :options="userOptions"/>
        </b-form-group>
      </b-form>

      <template slot="modal-footer">
        <b-row class="w-100 m-0">
          <b-col cols="auto" class="order-3 p-0">
            <b-button variant="primary" :disabled="processing" @click="save">Сохранить</b-button>
          </b-col>
          <b-col cols="auto" class="order-2 m-0">
            <b-button variant="secondary" @click="isVisible = false" :disabled="processing">Отмена</b-button>
          </b-col>
          <b-col cols="auto" class="order-1 mr-auto pl-0">
            <b-button variant="outline-danger" @click="deleteTask" :disabled="processing">Удалить</b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEIGN -->
<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
import autosize from 'autosize';

import CTaskUser from '@/components/TaskModal.vue';

import { Task, ITaskData } from '@/models/task';
import { IUserData } from '@/models/user';
import { Column } from '@/models/column';
import state from '@/models/state';

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
  private selectedUserId?: number;

  private columnOptions: Array<{ value?: number; text: string }> = [];
  private userOptions: Array<{ value?: number; text: string }> = [];

  // Component methods //
  //////////////////////

  public created() {
    this.syncColumns();
    this.syncUsers();

    this.$subscribeTo(state.columnManager.eventBus, () => {
      this.syncColumns();
    });

    this.$subscribeTo(state.userManager.eventBus, () => {
      this.syncUsers();
    });

    this.$on('lock', (lock: boolean) => {
      this.processing = lock;
    });

    this.$on('show', (task?: ITaskData) => {
      this.data = Object.assign({}, task) || new Task();
      autosize((this.$refs.description as Vue).$el);

      if (this.data.id !== 0) {
        state.taskManager.fetchOne(this.data.id).then(() => {
          const index = state.taskManager.tasks.findIndex(
            (task) => task.id === this.data.id
          );
          if (index < 0) {
            return;
          }
          this.data.assignedUsers =
            state.taskManager.tasks[index].assignedUsers;
        });
      }

      this.isVisible = true;
    });
  }

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
    if (
      this.processing ||
      !confirm('Вы действительно хотите удалить задачу?')
    ) {
      return;
    }

    this.processing = true;

    try {
      await state.taskManager.delete(this.data.id);

      this.$notify({
        title: 'Задача удалена',
        duration: 1500
      });

      this.isVisible = false;
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

  public syncUsers() {
    this.userOptions = state.userManager.users.map((user) => ({
      value: user.id,
      text: user.login
    }));
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

  .users-list {
    display: flex;
    flex-wrap: wrap;

    & > div {
      max-width: 100px;
      background-color: #3c3c3c;
      border: 1px solid #3c3c3c;
      margin: 0px 5px 5px 0px;
      padding: 0.375rem 1.75rem 0.375rem 0.75rem;
      font-weight: bold;
    }
  }
}
</style>
<!-- STYLE END -->
