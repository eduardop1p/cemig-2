import { Schema, model, models, type Document, Model } from 'mongoose';

import UserProtocol from '@/interfaces/userProtocol';

export interface UserDocumentProtocol
  extends Omit<UserProtocol, '_id'>,
    Document {}

const usersSchema = new Schema<UserDocumentProtocol>({
  userLogin: { type: String, required: true, default: '' },
  password: { type: String, required: true, default: '' },
  idDocument: { type: String, required: true, default: '' },
  name: { type: String, required: true, default: '' },
  email: { type: String, required: true, default: '' },
  phone: { type: String, required: true, default: '' },
  installations: [
    {
      siteNumber: { type: String, required: true, default: '' },
      status: { type: String, required: true, default: '' },
      address: { type: String, required: true, default: '' },
      contract: { type: String, required: true, default: '' },
      contractAccount: { type: String, required: true, default: '' },
      debts: [
        {
          documentContractAccount: {
            type: String,
            required: false,
            default: '',
          },
          dueDate: { type: String, required: false, default: '' },
          referenceMonth: { type: String, required: false, default: '' },
          status: { type: String, required: false, default: '' },
          value: { type: Number, required: false, default: 0 },
        },
      ],
    },
  ],
  createdIn: {
    type: Date,
    required: false,
    default: Date.now,
    index: { expires: '24h' },
  },
});

const usersModel: Model<UserDocumentProtocol> =
  models.CemigUsers || model<UserDocumentProtocol>('CemigUsers', usersSchema);

export default usersModel;
