export default interface UserProtocol {
  _id: string;
  userLogin: string;
  password: string;
  idDocument: string;
  name: string;
  email: string;
  phone: string;
  installations: {
    _id: string;
    siteNumber: string;
    status: string;
    address: string;
    contract: string;
    contractAccount: string;
    debts: {
      _id: string;
      documentContractAccount: string;
      dueDate: string;
      referenceMonth: string;
      status: string;
      value: number;
    }[];
  }[];
  createdIn: Date;
}
