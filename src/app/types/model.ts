export interface ModelDetails {
  parent_model: string
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}

export interface Model {
  name: string
  model: string
  modified_at: string
  size: number
  digest: string
  details: ModelDetails
}

export interface ModelsResponse {
  models: Model[]
}
