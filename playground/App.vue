<template>
  <div class="demo-wrapper">
    <!-- Header Banner -->
    <header class="demo-header">
      <div class="demo-badge">VUE 3 ENTERPRISE PIPELINE KIT</div>
      <h1>vue-kanban-board-kit</h1>
      <p>
        Unified ATS Candidate Pipeline, Succession Planning (9-Box Grid), VIP Referrals &amp; Task Management Board.
      </p>
    </header>

    <!-- Board Mode Tabs -->
    <div class="demo-tabs">
      <button
        type="button"
        class="demo-tab-btn"
        :class="{ active: currentMode === 'ats' }"
        @click="switchMode('ats')"
      >
        <span>💼</span> ATS &amp; Recruitment Pipeline
      </button>

      <button
        type="button"
        class="demo-tab-btn"
        :class="{ active: currentMode === 'succession' }"
        @click="switchMode('succession')"
      >
        <span>🎯</span> Succession Planning (9-Box)
      </button>

      <button
        type="button"
        class="demo-tab-btn"
        :class="{ active: currentMode === 'tasks' }"
        @click="switchMode('tasks')"
      >
        <span>⚡</span> Agile Task Board
      </button>
    </div>

    <!-- Live Board -->
    <KanbanBoardContainer
      :columns="kanban.columns.value"
      :cards-map="kanban.columnCardsMap.value"
      :search="kanban.searchQuery.value"
      :filter-vip-only="kanban.filterVipOnly.value"
      :filter-nine-box="kanban.filterNineBox.value"
      @update:search="kanban.searchQuery.value = $event"
      @update:filter-vip-only="kanban.filterVipOnly.value = $event"
      @update:filter-nine-box="kanban.filterNineBox.value = $event"
      @toggle-collapse="kanban.toggleColumnCollapse"
      @card-drag-start="kanban.onDragStart"
      @card-drag-end="kanban.onDragEnd"
      @card-drop="kanban.onDrop"
      @card-click="onCardClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoardContainer from '../src/components/KanbanBoardContainer.vue'
import { useKanban } from '../src/useKanban'
import type { KanbanColumn, KanbanCard } from '../src/types'

const currentMode = ref<'ats' | 'succession' | 'tasks'>('ats')

// Mock 1: ATS Candidate Pipeline & VIP Referrals
const atsColumns: KanbanColumn[] = [
  { id: 'sourcing', title: 'Sourcing & Inbound', color: '#3b82f6' },
  { id: 'screening', title: 'HR Screening', color: '#8b5cf6' },
  { id: 'interview', title: 'Technical Interview', color: '#f59e0b' },
  { id: 'offer', title: 'Offer & Contract', color: '#10b981' },
]

const atsCards: KanbanCard[] = [
  {
    id: 'c1',
    columnId: 'sourcing',
    title: 'Dr. Sarah Jenkins',
    appliedRole: 'Staff ML Engineer',
    referralName: 'VP of AI Research',
    isVip: true,
    experience: '8+ yrs exp',
    tags: ['Python', 'PyTorch', 'VIP Referral'],
    commentsCount: 5,
    attachmentsCount: 2,
  },
  {
    id: 'c2',
    columnId: 'sourcing',
    title: 'Alexandre Dubois',
    appliedRole: 'Senior Frontend Architect',
    isVip: false,
    experience: '6 yrs exp',
    tags: ['Vue 3', 'TypeScript'],
    commentsCount: 2,
    attachmentsCount: 1,
  },
  {
    id: 'c3',
    columnId: 'screening',
    title: 'Elena Rostova',
    appliedRole: 'Principal Cloud Architect',
    referralName: 'CEO Office',
    isVip: true,
    experience: '10 yrs exp',
    tags: ['AWS', 'Kubernetes'],
    commentsCount: 8,
    attachmentsCount: 3,
  },
  {
    id: 'c4',
    columnId: 'interview',
    title: 'Marcus Sterling',
    appliedRole: 'Engineering Manager',
    isVip: false,
    nineBox: 'top-talent',
    experience: '7 yrs exp',
    tags: ['Leadership', 'System Design'],
    commentsCount: 12,
    attachmentsCount: 4,
  },
  {
    id: 'c5',
    columnId: 'offer',
    title: 'Sofia Valerius',
    appliedRole: 'Lead Security Engineer',
    isVip: true,
    referralName: 'CISO',
    experience: '9 yrs exp',
    tags: ['Infosec', 'Zero-Trust'],
    commentsCount: 14,
    attachmentsCount: 5,
  },
]

const kanban = useKanban({
  columns: atsColumns,
  cards: atsCards,
  onCardMove: (payload) => {
    console.log('Card moved payload:', payload)
  },
})

function switchMode(mode: 'ats' | 'succession' | 'tasks') {
  currentMode.value = mode
  if (mode === 'ats') {
    kanban.columns.value = atsColumns
    kanban.cards.value = atsCards
  } else if (mode === 'succession') {
    kanban.columns.value = [
      { id: 'eval', title: 'Under Evaluation', color: '#6366f1' },
      { id: 'talent', title: 'High Potential & Stars', color: '#10b981' },
      { id: 'ready', title: 'Ready Now (Successor)', color: '#0ea5e9' },
    ]
    kanban.cards.value = [
      {
        id: 's1',
        columnId: 'talent',
        title: 'Tariq Mansoor',
        subtitle: 'Director of Platform Engineering',
        nineBox: 'top-talent',
        isVip: true,
        tags: ['Cycle 2026', 'Executive Ready'],
      },
      {
        id: 's2',
        columnId: 'eval',
        title: 'Fatima Al-Sayed',
        subtitle: 'Senior Product Lead',
        nineBox: 'high-potential',
        tags: ['Assessment Passed'],
      },
      {
        id: 's3',
        columnId: 'ready',
        title: 'Hamza Kareem',
        subtitle: 'Head of Data Infrastructure',
        nineBox: 'star',
        isVip: true,
        tags: ['Board Approved'],
      },
    ]
  } else {
    kanban.columns.value = [
      { id: 'todo', title: 'To Do', color: '#64748b' },
      { id: 'in_progress', title: 'In Progress', color: '#3b82f6' },
      { id: 'done', title: 'Completed', color: '#10b981' },
    ]
    kanban.cards.value = [
      {
        id: 't1',
        columnId: 'in_progress',
        title: 'Complete candidate onboarding workflow',
        description: 'Verify background checks, assign equipment and sync with HRIS.',
        tags: ['Onboarding', 'Priority High'],
        dueDate: '2026-09-05',
        commentsCount: 3,
      },
      {
        id: 't2',
        columnId: 'todo',
        title: 'Review VIP referral applications for Q3',
        description: 'Schedule fast-track executive screening sessions.',
        tags: ['VIP', 'Recruitment'],
        dueDate: '2026-09-08',
      },
      {
        id: 't3',
        columnId: 'done',
        title: 'Update Succession Planning 9-Box Matrix',
        description: 'Synchronized cycle submissions with leadership store.',
        tags: ['Succession'],
      },
    ]
  }
}

function onCardClick(card: KanbanCard) {
  alert(`Card Clicked: ${card.title} (ID: ${card.id})`)
}
</script>

<style scoped>
.demo-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

.demo-header {
  margin-bottom: 24px;
}

.demo-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.demo-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.demo-header p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

.demo-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.demo-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.demo-tab-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.demo-tab-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}
</style>
