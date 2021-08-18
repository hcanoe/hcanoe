export interface sheets {
  spreadsheets: {
    values: {
      get: (request: {
        spreadsheetId: string
        range: string
      }) => Promise<{ data: { values: Array<any> } }>
    },
    get: (request: {
      spreadsheetId: string
    }) => Promise<{ data: { sheets: Array<any> } }>
  }
}

export interface query {
  year: number,
  user: string,
}

export interface user_metadata {
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
