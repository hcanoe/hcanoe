export interface query {
  year: number,
  user: string,
}

export interface user_meta {
  Name?: string,
  GradYear?: string,
  Craft?: string,
  Gender?: string,
  Domain?: string,
  DisplayName?: string
}

export interface user_data_by_type {
  DISTANCE?: Distance,
  INTERVALS?: Intervals,
  ONOFF?: OnOff,
  TIMED?: Timed,
}

export type Distance = Array<{
  Type: string
  Distance: string
  Timing: string
  Date: string
  Pace: string
  best: Array<number>
  siDistance: number
  siTime: number
  siPace: number
  SortDate: number
}>

export type Intervals = Array<{
  Type: string
  Date: string
  Programme: Array<string>
  Timings: Array<string>
  Paces: Array<string>
  SortDate: number
  [propName: string]: any
}>

export type OnOff = Array<{
  Type: string
  Date: string
  Distance: string
  Programme?: string
  SortDate?: number
  [propName: string]: any
}>

export type Timed = Array<{
  Type: string
  Date: string
  Distance: string
  Pace: string
  Duration: string
  Programme: string
  SortDate: number
  [propName: string]: any
}>

export type SpreadsheetIds = Array<{
  Year: string
  Run?: string
  Strength?: string
  Paddling?: string
}>

export type TrainingType = 'Run' | 'Strength' | 'Paddling'
