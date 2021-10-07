export interface query {
  year: number,
  user: string,
  trainingType: string,
}

export interface UserMeta {
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
  type: string
  distance: string
  timing: string
  date: string
  pace: string
  best: Array<number>
  siDistance: number
  siTime: number
  siPace: number
  sortDate: number
}>

export type Intervals = Array<{
  type: string
  date: string
  programme: Array<string>
  timings: Array<string>
  paces: Array<string>
  sortDate: number
  [propName: string]: any
}>

export type OnOff = Array<{
  type: string
  date: string
  distance: string
  programme?: string
  sortDate?: number
  [propName: string]: any
}>

export type Timed = Array<{
  type: string
  date: string
  distance: string
  pace: string
  duration: string
  programme: string
  sortDate: number
  [propName: string]: any
}>

export type SpreadsheetIds = Array<{
  year: string
  run?: string
  strength?: string
  paddling?: string
}>

export type TrainingType = 'run' | 'strength' | 'paddling'
