export const REQUIRED_KEYS = {
  column: ['id', 'title'] as const,
  card: ['id', 'title', 'columnId'] as const,
} as const

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low'
export type NineBoxCategory =
  | 'top-talent'
  | 'high-potential'
  | 'star'
  | 'core-talent'
  | 'valued-professional'
  | 'unrealized-potential'
  | 'inconsistent-performer'
  | 'limited-potential'
  | 'improve-redeploy'

export interface KanbanTag {
  label: string
  color?: string
  bg?: string
}

export interface KanbanCard {
  id: string | number
  columnId: string | number
  title: string
  subtitle?: string
  description?: string
  avatar?: string
  assignee?: string
  priority?: PriorityLevel
  tags?: (string | KanbanTag)[]
  dueDate?: string | Date
  nineBox?: NineBoxCategory | string
  isVip?: boolean
  referralName?: string
  appliedRole?: string
  department?: string
  experience?: string
  progress?: number
  attachmentsCount?: number
  commentsCount?: number
  createdAt?: string | Date
  meta?: Record<string, any>
}

export interface KanbanColumn {
  id: string | number
  title: string
  color?: string
  limit?: number
  collapsed?: boolean
  headerBadge?: string | number
}

export interface CardMovePayload {
  cardId: string | number
  fromColumnId: string | number
  toColumnId: string | number
  oldIndex: number
  newIndex: number
  card: KanbanCard
}

export class MissingKeysError extends Error {
  readonly missing: string[]
  readonly kind: string

  constructor(kind: string, missing: string[]) {
    super(`vue-kanban-board-kit: ${kind} is missing required key(s): ${missing.join(', ')}`)
    this.name = 'MissingKeysError'
    this.kind = kind
    this.missing = missing
  }
}
