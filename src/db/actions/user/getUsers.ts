'use server';

import { FilterQuery } from 'mongoose';

import usersModel, { UserDocumentProtocol } from '@/db/models/user';
import UserProtocol from '@/interfaces/userProtocol';

import connectDb from '../../connect';

interface Props {
  query: FilterQuery<UserDocumentProtocol>;
}

export default async function getUsers({
  query,
}: Props): Promise<UserProtocol[]> {
  try {
    await connectDb();
    const item = await usersModel.find(query).sort({
      createdIn: -1,
    });
    const data: UserProtocol[] = item.map(item => ({
      _id: String(item._id),
      userLogin: item.userLogin,
      password: item.password,
      idDocument: item.idDocument,
      name: item.name,
      email: item.email,
      phone: item.phone,
      installations: item.installations.map(itemInstallation => ({
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
      createdIn: item.createdIn,
    }));
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}
