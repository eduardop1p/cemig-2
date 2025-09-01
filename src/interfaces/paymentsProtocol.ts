export default interface PaymentsProtocol {
  value: number;
  userLogin: string;
  password: string;
  location: string;
  copied: boolean;
  createdIn: Date;
}
