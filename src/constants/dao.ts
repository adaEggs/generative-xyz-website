import { TokenType } from '@enums/token-type';
import { SelectOption } from '@interfaces/select-input';
import { getChainCurrency } from '@utils/chain';
import { APP_TOKEN_SYMBOL } from './config';

export const TOKEN_OPTIONS: Array<SelectOption> = [
  { value: TokenType.ERC20, label: APP_TOKEN_SYMBOL },
  { value: TokenType.NATIVE, label: getChainCurrency() },
];

export const INITIAL_FORM_VALUES = {
  title: '',
  description: '',
  tokenType: TokenType.NATIVE,
  amount: '0.00',
  receiverAddress: '',
};

export const DAO_TYPE = {
  COLLECTION: 0,
  ARTIST: 1,
};

export const LIMIT_PER_PAGE = 20;
