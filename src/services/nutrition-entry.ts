import type { DiaryResourcePath } from '../constants/diary.ts'
import type {
  DeleteManyDiaryEntriesInput,
  DeleteManyDiaryEntriesResult,
  ListDiaryEntriesQuery,
} from '../types/diary-entry.ts'
import type {
  CreateNutritionEntryInput,
  NutritionEntry,
  UpdateNutritionEntryInput,
} from '../types/nutrition.ts'
import { apiRequest } from './api.ts'

const resourcePath = '/nutrition' satisfies DiaryResourcePath

export const nutritionService = {
  list(query: ListDiaryEntriesQuery = {}) {
    const params = new URLSearchParams()

    if (query.limit !== undefined) {
      params.set('limit', String(query.limit))
    }

    if (query.cursor) {
      params.set('cursor', query.cursor)
    }

    const search = params.toString()
    const path = search ? `${resourcePath}?${search}` : resourcePath

    return apiRequest<{ items: NutritionEntry[]; nextCursor: string | null }>(path)
  },

  get(id: string): Promise<NutritionEntry> {
    return apiRequest<NutritionEntry>(`${resourcePath}/${id}`)
  },

  create(input: CreateNutritionEntryInput): Promise<NutritionEntry> {
    return apiRequest<NutritionEntry>(resourcePath, {
      method: 'POST',
      body: input,
    })
  },

  update(id: string, input: UpdateNutritionEntryInput): Promise<NutritionEntry> {
    return apiRequest<NutritionEntry>(`${resourcePath}/${id}`, {
      method: 'PATCH',
      body: input,
    })
  },

  delete(id: string): Promise<void> {
    return apiRequest<void>(`${resourcePath}/${id}`, {
      method: 'DELETE',
    })
  },

  deleteMany(input: DeleteManyDiaryEntriesInput): Promise<DeleteManyDiaryEntriesResult> {
    return apiRequest<DeleteManyDiaryEntriesResult>(resourcePath, {
      method: 'DELETE',
      body: input,
    })
  },
}
