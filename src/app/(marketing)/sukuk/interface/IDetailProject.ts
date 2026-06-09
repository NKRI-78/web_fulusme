export interface IDetailProject {
  status: number
  error: boolean
  message: string
  data: IDetailProjectData
}

export interface IDetailProjectData {
  id: string
  title: string
  goal: string
  medias: Media[]
  location: Location
  doc: Doc
  capital: string
  roi: string
  min_invest: string
  unit_price: string
  unit_total: string
  number_of_unit: string
  periode: string
  type_of_bond: string
  nominal_value: string
  time_periode: string
  interest_rate: string
  interest_payment_schedule: string
  principal_payment_schedule: string
  use_of_funds: string
  collateral_guarantee: string
  desc_job: string
  is_apbn: boolean
  is_approved: boolean
  company: Company
  created_at: string
  updated_at: string
}

export interface Media {
  id: number
  path: string
}

export interface Location {
  id: number
  name: string
  url: string
  lat: string
  lng: string
}

export interface Doc {
  id: string
  path: string
}

export interface Company {
  name: string
}
