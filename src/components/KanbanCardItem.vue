<template>
  <div
    class="vkb-card"
    :class="{ 'is-dragging': isDragging, 'has-vip': card.isVip }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="emit('click', card)"
  >
    <!-- VIP Ribbon Badge -->
    <div v-if="card.isVip" class="vkb-vip-badge">
      ★ VIP
    </div>

    <!-- 9-Box Succession Badge -->
    <div
      v-if="card.nineBox"
      class="vkb-ninebox-pill"
      :class="`vkb-ninebox-${slugify(card.nineBox)}`"
    >
      <span>🎯</span> {{ formatNineBox(card.nineBox) }}
    </div>

    <!-- Card Header with Avatar -->
    <div class="vkb-card-header">
      <div v-if="card.avatar || card.assignee || card.title" class="vkb-avatar">
        <img v-if="card.avatar" :src="card.avatar" :alt="card.title" />
        <span v-else>{{ getInitials(card.assignee || card.title) }}</span>
      </div>

      <div class="vkb-card-titles">
        <div class="vkb-card-title" :title="card.title">{{ card.title }}</div>
        <div v-if="card.subtitle || card.appliedRole" class="vkb-card-subtitle">
          {{ card.subtitle || card.appliedRole }}
        </div>
      </div>
    </div>

    <!-- Description (optional) -->
    <div v-if="card.description" class="vkb-card-desc">
      {{ card.description }}
    </div>

    <!-- Tags Row -->
    <div v-if="card.tags && card.tags.length" class="vkb-tags-wrap">
      <span
        v-for="(tag, idx) in card.tags"
        :key="idx"
        class="vkb-tag"
        :style="getTagStyle(tag)"
      >
        {{ typeof tag === 'string' ? tag : tag.label }}
      </span>
    </div>

    <!-- Card Footer (Referral / Experience / Comments / Attachments / Date) -->
    <div class="vkb-card-footer">
      <div class="vkb-footer-meta">
        <span v-if="card.referralName" class="vkb-meta-item" title="Referral Source">
          👤 Ref: {{ card.referralName }}
        </span>
        <span v-else-if="card.experience" class="vkb-meta-item">
          💼 {{ card.experience }}
        </span>
        <span v-if="card.dueDate" class="vkb-meta-item">
          📅 {{ formatDueDate(card.dueDate) }}
        </span>
      </div>

      <div class="vkb-footer-meta">
        <span v-if="card.commentsCount" class="vkb-meta-item" title="Comments">
          💬 {{ card.commentsCount }}
        </span>
        <span v-if="card.attachmentsCount" class="vkb-meta-item" title="Attachments">
          📎 {{ card.attachmentsCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { KanbanCard, KanbanTag } from '../types'

const props = defineProps<{
  card: KanbanCard
}>()

const emit = defineEmits<{
  'drag-start': [card: KanbanCard]
  'drag-end': []
  click: [card: KanbanCard]
}>()

const isDragging = ref(false)

function onDragStart(e: DragEvent) {
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', String(props.card.id))
    e.dataTransfer.effectAllowed = 'move'
  }
  emit('drag-start', props.card)
}

function onDragEnd() {
  isDragging.value = false
  emit('drag-end')
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function slugify(text: string): string {
  return String(text).toLowerCase().replace(/\s+/g, '-')
}

function formatNineBox(val: string): string {
  return String(val)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getTagStyle(tag: string | KanbanTag) {
  if (typeof tag === 'string') return {}
  return {
    color: tag.color,
    backgroundColor: tag.bg,
    borderColor: tag.color ? `${tag.color}40` : undefined,
  }
}

function formatDueDate(d?: string | Date): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
