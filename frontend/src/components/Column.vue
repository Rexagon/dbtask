<!-- TEMPLATE BEGIN -->
<template>
  <div class="column">{{ column.name }}</div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Column } from '@/models/column';

@Component
export default class CColumn extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public column!: Column;
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->