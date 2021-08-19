export interface query {
  year: number,
  user: string,
}

export interface user_meta {
  Name?: string,
  GradYear?: number,
  Craft?: string,
  Gender?: string,
  Domain?: string,
  DisplayName?: string
}

export interface user_data_by_type {
  DISTANCE: Distance,
  INTERVALS: Intervals,
  ONOFF: Array<string>,
  TIMED: Array<string>,
}

export type Distance = Array<{
  Distance: string
  Timing: string
  Type: string
  Date: string
  Pace?: string
  best?: Array<number>
  si_distance?: number
  si_time?: number
  si_pace?: number
  SortDate?: number
}>

export type Intervals = Array<{
  Type: string
  Date: string
  Programme: Array<string>
  Paces: Array<string>
  SortDate?: number
  [propName: string]: any
}>

export type SpreadsheetIds = Array<{
  Year: string
  Run?: string
  Strength?: string
  Paddling?: string
}>

export type TrainingType = 'Run' | 'Strength' | 'Paddling'
