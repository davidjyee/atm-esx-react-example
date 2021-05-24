import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
  START_TRANSFER,
  FINISH_TRANSFER,
} from '../actions';

import { Account, Transaction } from '../types';

interface AccountState extends Account {
  transactionLock: boolean;
}

const initialState: AccountState = {
  name: 'Personal',
  type: 'Personal',
  id: 1234567890,
  routing: 100,
  balance: 100,
  transactionLock: false,
};

function transact(account: AccountState, action: AnyAction): AccountState {
  const newState = {
    ...account,
    transactionLock: false,
  };

  if (action.success) {
    const transaction: Transaction = action.transaction;

    switch (action.type) {
      case FINISH_DEPOSIT:
        newState.balance += transaction.amount;
        break;
      case FINISH_WITHDRAW:
        newState.balance -= transaction.amount;
        break;
      case FINISH_TRANSFER:
        if (transaction.origin === newState.id) {
          newState.balance += transaction.amount;
        } else if (transaction.destination === newState.id) {
          newState.balance -= transaction.amount;
        }
        break;
      default:
        break;
    }
  }

  return newState;
}

export default function accountReducer(
  state: AccountState = initialState,
  action: AnyAction
): AccountState {
  switch (action.type) {
    case START_WITHDRAW:
    case START_DEPOSIT:
    case START_TRANSFER:
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_WITHDRAW:
    case FINISH_DEPOSIT:
    case FINISH_TRANSFER:
      return transact(state, action);
    default:
      return state;
  }
}
