export const DIARY_PAGE_SIZE = 20

export const DIARY_RESOURCES = {
  workouts: '/workouts',
  nutrition: '/nutrition',
  measurements: '/measurements',
} as const

export type DiaryResourcePath = (typeof DIARY_RESOURCES)[keyof typeof DIARY_RESOURCES]
