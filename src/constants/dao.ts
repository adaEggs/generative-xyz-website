import { TokenType } from '@enums/token-type';
import { SelectOption } from '@interfaces/select-input';
import { getChainCurrency } from '@utils/chain';

export const TOKEN_OPTIONS: Array<SelectOption> = [
  { value: TokenType.ERC20, label: 'GEN' },
  { value: TokenType.NATIVE, label: getChainCurrency() },
];
