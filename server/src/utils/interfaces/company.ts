export interface ICreateCompany {
  name: string,
  surname: string,
  companyName:string,
  email:string,
  password:string
}

export interface ICompany extends ICreateCompany {
  name: string,
  surname: string,
  companyName:string,
  email:string,
  password:string
  phoneNumber:string,
  privKeyNumber: string
}
