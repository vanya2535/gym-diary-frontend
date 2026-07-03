export type DiaryEntry = {
  id: string
  content: string
  authorId: string
  createdAt: string
}

export type PaginatedDiaryEntries = {
  items: DiaryEntry[]
  nextCursor: string | null
}

export type CreateDiaryEntryInput = {
  content: string
}

export type UpdateDiaryEntryInput = {
  content: string
}

export type DeleteManyDiaryEntriesInput = {
  ids: string[]
}

export type DeleteManyDiaryEntriesResult = {
  deleted: number
}

export type ListDiaryEntriesQuery = {
  cursor?: string
  limit?: number
}
