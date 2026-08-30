<template>
  <div class="vkb-root" :style="customStyle">
    <div class="vkb-container">
      <!-- Toolbar with Search, VIP Filter, and Nine-box tags -->
      <div v-if="showToolbar" class="vkb-toolbar">
        <div v-if="showSearch" class="vkb-search-wrapper">
          <span class="vkb-search-icon">🔍</span>
          <input
            :value="search"
            type="text"
            class="vkb-search-input"
            :placeholder="searchPlaceholder"
            @input="emit('update:search', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="vkb-filter-group">
          <!-- VIP Only Toggle -->
          <button
            v-if="showVipFilter"
            type="button"
            class="vkb-filter-btn"
            :class="{ active: filterVipOnly }"
            @click="emit('update:filterVipOnly', !filterVipOnly)"
          >
            <span>★</span> VIP Only
          </button>

          <!-- Succession 9-box dropdown / chips -->
          <button
            v-if="showNineBoxFilter"
            type="button"
            class="vkb-filter-btn"
            :class="{ active: filterNineBox === 'top-talent' }"
            @click="toggleNineBox('top-talent')"
          >
            <span>🎯</span> Top Talent
          </button>

          <button
            v-if="showNineBoxFilter"
            type="button"
            class="vkb-filter-btn"
            :class="{ active: filterNineBox === 'high-potential' }"
            @click="toggleNineBox('high-potential')"
          >
            <span>🚀</span> High Potential
          </button>

          <!-- Custom toolbar actions slot (e.g. Add Task / Export) -->
          <slot name="toolbar-actions" />
        </div>
      </div>

      <!-- Kanban Board Columns Surface -->
      <div class="vkb-board">
        <KanbanColumnItem
          v-for="col in columns"
          :key="col.id"
          :column="col"
          :cards="cardsMap[col.id] || []"
          @toggle-collapse="emit('toggle-collapse', $event)"
          @card-drag-start="emit('card-drag-start', $event)"
          @card-drag-end="emit('card-drag-end')"
          @card-click="emit('card-click', $event)"
          @drop="emit('card-drop', $event)"
        >
          <!-- Forward Card Slot -->
          <template #card="{ card }">
            <slot name="card" :card="card" />
          </template>

          <!-- Forward Empty Column Slot -->
          <template #empty-column>
            <slot name="empty-column" />
          </template>
        </KanbanColumnItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KanbanColumn, KanbanCard } from '../types'
import KanbanColumnItem from './KanbanColumnItem.vue'

const props = withDefaults(
  defineProps<{
    columns: KanbanColumn[]
    cardsMap: Record<string | number, KanbanCard[]>
    search?: string
    filterVipOnly?: boolean
    filterNineBox?: string
    showToolbar?: boolean
    showSearch?: boolean
    showVipFilter?: boolean
    showNineBoxFilter?: boolean
    searchPlaceholder?: string
    primaryColor?: string
  }>(),
  {
    search: '',
    filterVipOnly: false,
    filterNineBox: '',
    showToolbar: true,
    showSearch: true,
    showVipFilter: true,
    showNineBoxFilter: true,
    searchPlaceholder: 'Search candidate, task, or referral...',
  }
)

const emit = defineEmits<{
  'update:search': [val: string]
  'update:filterVipOnly': [val: boolean]
  'update:filterNineBox': [val: string]
  'toggle-collapse': [columnId: string | number]
  'card-drag-start': [card: KanbanCard]
  'card-drag-end': []
  'card-click': [card: KanbanCard]
  'card-drop': [toColumnId: string | number]
}>()

const customStyle = computed(() => {
  return props.primaryColor ? { '--vkb-primary': props.primaryColor } : {}
})

function toggleNineBox(val: string) {
  const next = props.filterNineBox === val ? '' : val
  emit('update:filterNineBox', next)
}
</script>
