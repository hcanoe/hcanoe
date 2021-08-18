export interface metadata {
  Name: string
  GradYear: number
  Gender?: string
  Craft?: string
  DisplayName?: string
  Domain?: string
}
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
  Name: string,
  GradYear: number,
  Craft?: string,
  Gender?: string,
  Domain?: string,
  DisplayName?: string
}

export interface user_data_by_type {
  DISTANCE: any,
  INTERVALS: any,
  ONOFF: any,
  TIMED: any,
}
