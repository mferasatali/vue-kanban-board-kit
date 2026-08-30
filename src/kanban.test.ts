import { describe, expect, it } from 'vitest'
import { REQUIRED_KEYS, type KanbanColumn, type KanbanCard } from './types'
import { missingKeys, hasRequired, assertRequired } from './pick'
import { useKanban } from './useKanban'

describe('vue-kanban-board-kit contracts', () => {
  it('validates column required keys', () => {
    expect(missingKeys({ title: 'Backlog' }, REQUIRED_KEYS.column)).toEqual(['id'])
    expect(hasRequired({ id: 'c1', title: 'Backlog' }, REQUIRED_KEYS.column)).toBe(true)
  })

  it('validates card required keys', () => {
    expect(missingKeys({ id: 1, title: 'Interview' }, REQUIRED_KEYS.card)).toEqual(['columnId'])
  })

  it('throws on missing keys', () => {
    expect(() =>
      assertRequired('column', { title: 'Screening' } as unknown as KanbanColumn, REQUIRED_KEYS.column)
    ).toThrow(/missing required key/)
  })
})

describe('useKanban composable', () => {
  const columns: KanbanColumn[] = [
    { id: 'sourcing', title: 'Sourcing' },
    { id: 'interview', title: 'Interview' },
    { id: 'offer', title: 'Offer' },
  ]

  const cards: KanbanCard[] = [
    { id: 'cd1', columnId: 'sourcing', title: 'Alice Smith', isVip: true, nineBox: 'top-talent' },
    { id: 'cd2', columnId: 'sourcing', title: 'Bob Jones', isVip: false },
  ]

  it('moves card between columns and triggers onCardMove', () => {
    let movedPayload: any = null
    const { moveCard, getCardsByColumn } = useKanban({
      columns,
      cards,
      onCardMove: (p) => {
        movedPayload = p
      },
    })

    moveCard('cd1', 'interview')
    expect(getCardsByColumn('interview')).toHaveLength(1)
    expect(getCardsByColumn('sourcing')).toHaveLength(1)
    expect(movedPayload?.cardId).toBe('cd1')
    expect(movedPayload?.toColumnId).toBe('interview')
  })

  it('filters VIP and 9-box succession cards', () => {
    const { filterVipOnly, filterNineBox, getCardsByColumn } = useKanban({
      columns,
      cards,
    })

    filterVipOnly.value = true
    expect(getCardsByColumn('sourcing')).toHaveLength(1)
    expect(getCardsByColumn('sourcing')[0].title).toBe('Alice Smith')

    filterVipOnly.value = false
    filterNineBox.value = 'top-talent'
    expect(getCardsByColumn('sourcing')).toHaveLength(1)
  })
})
