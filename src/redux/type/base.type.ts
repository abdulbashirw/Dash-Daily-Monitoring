export type ResponseData<TData> = {
  code: number
  status: string
  message: string | null
  data: TData
}
