import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
  SWAP_ACCOUNT,
} from '../actions';

import { User, Transaction, AccessLevel, AccessInfo } from '../types';

interface Status extends User {
  cash: number;
  accountAccess: AccessLevel;
  transactionLock: boolean;
}

const initialState: Status = {
  name: 'Akihiro Sakamoto',
  id: 816,
  cash: 100,
  accountAccess: 0,
  transactionLock: false,
};

function transact(account: Status, action: AnyAction): Status {
  const newState = {
    ...account,
    transactionLock: false,
  };

  if (action.success) {
    const transaction: Transaction = action.transaction;

    switch (action.type) {
      case FINISH_DEPOSIT:
        newState.cash -= transaction.amount;
        break;
      case FINISH_WITHDRAW:
        newState.cash += transaction.amount;
        break;
      default:
        break;
    }
  }

  return newState;
}

function updateAccess(state: Status, accessMap: Array<AccessInfo>): AccessLevel {
  const accessLevel = accessMap.find(
    (info: AccessInfo) => info.userId === state.id
  )?.accessLevel;

  if (accessLevel) {
    return accessLevel;
  } else {
    return 0;
  }
}

export default function statusReducer(
  state: Status = initialState,
  action: AnyAction
): Status {
  switch (action.type) {
    case START_WITHDRAW:
    case START_DEPOSIT:
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_WITHDRAW:
    case FINISH_DEPOSIT:
      return transact(state, action);
    case SWAP_ACCOUNT:
      return {
        ...state,
        accountAccess: updateAccess(state, action.accessMap),
      };
    default:
      return state;
  }
}
