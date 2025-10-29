export enum AuthField {
  Name = 'name',
  Password = 'password',
}

export type AuthData = {
  token: string
}

export type AuthPayload = {
  [AuthField.Name]: string
  [AuthField.Password]: string
}
