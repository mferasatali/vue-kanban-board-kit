<template>
  <div
    class="vkb-column"
    :class="{ 'is-collapsed': column.collapsed, 'is-drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column Header -->
    <div class="vkb-column-header">
      <div class="vkb-col-header-left">
        <span
          class="vkb-col-dot"
          :style="{ background: column.color || 'var(--vkb-primary)' }"
        ></span>
        <span class="vkb-col-title">{{ column.title }}</span>
        <span class="vkb-col-count">{{ cards.length }}</span>
      </div>

      <div class="vkb-col-header-right">
        <slot name="column-header-actions" :column="column">
          <button
            type="button"
            class="vkb-col-collapse-btn"
            :title="column.collapsed ? 'Expand column' : 'Collapse column'"
            @click="emit('toggle-collapse', column.id)"
          >
            {{ column.collapsed ? '▶' : '◀' }}
          </button>
        </slot>
      </div>
    </div>

    <!-- Cards Feed -->
    <div v-if="!column.collapsed" class="vkb-cards-feed">
      <template v-if="cards.length">
        <slot
          v-for="card in cards"
          :key="card.id"
          name="card"
          :card="card"
        >
          <KanbanCardItem
            :card="card"
            @drag-start="emit('card-drag-start', $event)"
            @drag-end="emit('card-drag-end')"
            @click="emit('card-click', $event)"
          />
        </slot>
      </template>

      <!-- Empty column slot / drop target -->
      <div v-else class="vkb-empty-column">
        <slot name="empty-column">
          <span>Drop items here</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { KanbanColumn, KanbanCard } from '../types'
import KanbanCardItem from './KanbanCardItem.vue'

const props = defineProps<{
  column: KanbanColumn
  cards: KanbanCard[]
}>()

const emit = defineEmits<{
  'toggle-collapse': [columnId: string | number]
  'card-drag-start': [card: KanbanCard]
  'card-drag-end': []
  'card-click': [card: KanbanCard]
  drop: [columnId: string | number]
}>()

const isDragOver = ref(false)

function onDragOver() {
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  emit('drop', props.column.id)
}
</script>
