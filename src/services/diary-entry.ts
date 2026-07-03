import type { DiaryResourcePath } from '../constants/diary.ts'
import type {
  CreateDiaryEntryInput,
  DeleteManyDiaryEntriesInput,
  DeleteManyDiaryEntriesResult,
  DiaryEntry,
  ListDiaryEntriesQuery,
  PaginatedDiaryEntries,
  UpdateDiaryEntryInput,
} from '../types/diary-entry.ts'
import { apiRequest } from './api.ts'

export function createDiaryEntryService(resourcePath: DiaryResourcePath) {
  return {
    list(query: ListDiaryEntriesQuery = {}): Promise<PaginatedDiaryEntries> {
      const params = new URLSearchParams()

      if (query.limit !== undefined) {
        params.set('limit', String(query.limit))
      }

      if (query.cursor) {
        params.set('cursor', query.cursor)
      }

      const search = params.toString()
      const path = search ? `${resourcePath}?${search}` : resourcePath

      return apiRequest<PaginatedDiaryEntries>(path)
    },

    get(id: string): Promise<DiaryEntry> {
      return apiRequest<DiaryEntry>(`${resourcePath}/${id}`)
    },

    create(input: CreateDiaryEntryInput): Promise<DiaryEntry> {
      return apiRequest<DiaryEntry>(resourcePath, {
        method: 'POST',
        body: input,
      })
    },

    update(id: string, input: UpdateDiaryEntryInput): Promise<DiaryEntry> {
      return apiRequest<DiaryEntry>(`${resourcePath}/${id}`, {
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
}

export const workoutsService = createDiaryEntryService('/workouts')
export const nutritionService = createDiaryEntryService('/nutrition')
export const measurementsService = createDiaryEntryService('/measurements')
