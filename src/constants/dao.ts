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
