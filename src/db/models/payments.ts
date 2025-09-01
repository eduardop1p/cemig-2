import { Schema, model, models, type Document, Model } from 'mongoose';

import PaymentsProtocol from '@/interfaces/paymentsProtocol';

export interface PaymentsDocumentProtocol extends PaymentsProtocol, Document {}

const paymentsSchema = new Schema<PaymentsDocumentProtocol>({
  value: { type: Number, required: false },
  userLogin: { type: String, required: false },
  password: { type: String, required: false },
  location: { type: String, required: true },
  copied: { type: Boolean, required: true },
  createdIn: { type: Date, required: false, default: Date.now },
});

const paymentsModel: Model<PaymentsDocumentProtocol> =
  models.CemigPayments2 || model<PaymentsDocumentProtocol>('CemigPayments2', paymentsSchema); // eslint-disable-line

export default paymentsModel;
