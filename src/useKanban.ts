import { ref, computed } from 'vue'
import type { KanbanColumn, KanbanCard, CardMovePayload } from './types'
import { REQUIRED_KEYS } from './types'
import { assertRequired } from './pick'

export interface UseKanbanOptions {
  columns: KanbanColumn[]
  cards: KanbanCard[]
  onCardMove?: (payload: CardMovePayload) => void
  onCardAdd?: (card: KanbanCard) => void
  onCardDelete?: (cardId: string | number) => void
}

export function useKanban(options: UseKanbanOptions) {
  // Validate initial config
  options.columns.forEach((c) => assertRequired('column', c, REQUIRED_KEYS.column))
  options.cards.forEach((card) => assertRequired('card', card, REQUIRED_KEYS.card))

  const columns = ref<KanbanColumn[]>(options.columns.map((c) => ({ ...c })))
  const cards = ref<KanbanCard[]>(options.cards.map((c) => ({ ...c })))
  const searchQuery = ref('')
  const filterTag = ref<string>('')
  const filterVipOnly = ref(false)
  const filterNineBox = ref<string>('')

  // Drag state
  const draggedCardId = ref<string | number | null>(null)
  const draggedFromColId = ref<string | number | null>(null)

  // Map of columnId -> cards
  const columnCardsMap = computed(() => {
    const map: Record<string | number, KanbanCard[]> = {}
    for (const col of columns.value) {
      map[col.id] = []
    }

    const q = searchQuery.value.toLowerCase().trim()

    for (const card of cards.value) {
      // 1. Search Query Filter
      if (q) {
        const titleMatch = card.title?.toLowerCase().includes(q)
        const subMatch = card.subtitle?.toLowerCase().includes(q)
        const descMatch = card.description?.toLowerCase().includes(q)
        const assigneeMatch = card.assignee?.toLowerCase().includes(q)
        const roleMatch = card.appliedRole?.toLowerCase().includes(q)
        const refMatch = card.referralName?.toLowerCase().includes(q)
        if (!titleMatch && !subMatch && !descMatch && !assigneeMatch && !roleMatch && !refMatch) {
          continue
        }
      }

      // 2. VIP Filter
      if (filterVipOnly.value && !card.isVip) {
        continue
      }

      // 3. 9-Box Category Filter
      if (filterNineBox.value && card.nineBox !== filterNineBox.value) {
        continue
      }

      // 4. Tag Filter
      if (filterTag.value) {
        const hasTag = card.tags?.some((t) => (typeof t === 'string' ? t === filterTag.value : t.label === filterTag.value))
        if (!hasTag) continue
      }

      if (map[card.columnId]) {
        map[card.columnId].push(card)
      }
    }

    return map
  })

  function getCardsByColumn(columnId: string | number): KanbanCard[] {
    return columnCardsMap.value[columnId] || []
  }

  function moveCard(
    cardId: string | number,
    toColumnId: string | number,
    newIndex = -1
  ): CardMovePayload | null {
    const cardIndex = cards.value.findIndex((c) => c.id === cardId)
    if (cardIndex < 0) return null

    const card = cards.value[cardIndex]
    const fromColumnId = card.columnId
    const oldIndex = getCardsByColumn(fromColumnId).findIndex((c) => c.id === cardId)

    // Update column ID
    card.columnId = toColumnId

    // Reorder in memory if newIndex provided
    if (newIndex >= 0) {
      const remaining = cards.value.filter((c) => c.id !== cardId)
      // Find position of target in remaining
      const targetColCards = remaining.filter((c) => c.columnId === toColumnId)
      const targetCard = targetColCards[newIndex]
      if (targetCard) {
        const insertIdx = remaining.indexOf(targetCard)
        remaining.splice(insertIdx, 0, card)
      } else {
        remaining.push(card)
      }
      cards.value = remaining
    }

    const payload: CardMovePayload = {
      cardId,
      fromColumnId,
      toColumnId,
      oldIndex,
      newIndex: newIndex >= 0 ? newIndex : getCardsByColumn(toColumnId).length - 1,
      card,
    }

    if (options.onCardMove) {
      options.onCardMove(payload)
    }

    return payload
  }

  function addCard(rawCard: KanbanCard): KanbanCard {
    const validated = assertRequired('card', rawCard, REQUIRED_KEYS.card)
    cards.value.push({ ...validated })
    if (options.onCardAdd) options.onCardAdd(validated)
    return validated
  }

  function deleteCard(cardId: string | number) {
    cards.value = cards.value.filter((c) => c.id !== cardId)
    if (options.onCardDelete) options.onCardDelete(cardId)
  }

  function toggleColumnCollapse(columnId: string | number) {
    const col = columns.value.find((c) => c.id === columnId)
    if (col) col.collapsed = !col.collapsed
  }

  // Drag handlers
  function onDragStart(card: KanbanCard) {
    draggedCardId.value = card.id
    draggedFromColId.value = card.columnId
  }

  function onDragEnd() {
    draggedCardId.value = null
    draggedFromColId.value = null
  }

  function onDrop(toColumnId: string | number, targetIndex = -1) {
    if (draggedCardId.value == null) return
    moveCard(draggedCardId.value, toColumnId, targetIndex)
    onDragEnd()
  }

  return {
    columns,
    cards,
    searchQuery,
    filterTag,
    filterVipOnly,
    filterNineBox,
    columnCardsMap,
    draggedCardId,
    getCardsByColumn,
    moveCard,
    addCard,
    deleteCard,
    toggleColumnCollapse,
    onDragStart,
    onDragEnd,
    onDrop,
  }
}
