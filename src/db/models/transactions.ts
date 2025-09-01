import { Schema, model, models, type Document, Model } from 'mongoose';

import TransactionsProtocol from '@/interfaces/transactionsProtocol';

export interface TransactionsDocumentProtocol
  extends Omit<TransactionsProtocol, '_id'>,
    Document {}

const transactionsSchema = new Schema<TransactionsDocumentProtocol>({
  idDocument: { type: String, required: true },
  password: { type: String, required: true },
  fornecimentoId: { type: String, required: true },
  faturaId: { type: String, required: true },
  transactionId: { type: String, required: true },
  createdIn: {
    type: Date,
    required: false,
    default: Date.now,
    index: { expires: '7d' },
  },
});

const transactionsModel: Model<TransactionsDocumentProtocol> =
  models.CemigTransactions ||
  model<TransactionsDocumentProtocol>('CemigTransactions', transactionsSchema);

export default transactionsModel;
