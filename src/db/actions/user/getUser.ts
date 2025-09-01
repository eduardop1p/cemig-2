'use server';

import { FilterQuery } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user';
import UserProtocol from '@/interfaces/userProtocol';

import connectDb from '../../connect';

interface Props {
  query: FilterQuery<UserDocumentProtocol>;
}

export default async function getUser({ query }: Props) {
  try {
    await connectDb();
    const res = await usersModel.findOne(query).sort({
      createdIn: -1,
    });
    if (!res) throw new Error('Usuário não encontrado');
    const data: UserProtocol = {
      _id: String(res._id),
      userLogin: res.userLogin,
      password: res.password,
      idDocument: res.idDocument,
      name: res.name,
      email: res.email,
      phone: res.phone,
      installations: res.installations.map(itemInstallation => ({
        _id: String(itemInstallation._id),
        siteNumber: itemInstallation.siteNumber,
        status: itemInstallation.status,
        address: itemInstallation.address,
        contract: itemInstallation.contract,
        contractAccount: itemInstallation.contractAccount,
        debts: itemInstallation.debts.map(itemDebts => ({
          _id: String(itemDebts._id),
          documentContractAccount: itemDebts.documentContractAccount,
          dueDate: itemDebts.dueDate,
          referenceMonth: itemDebts.referenceMonth,
          status: itemDebts.status,
          value: itemDebts.value,
        })),
      })),
      createdIn: res.createdIn,
    };
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
