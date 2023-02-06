export type NFTHolder = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: null | boolean;
  logo_url: string;
  address: string;
  balance: string;
  total_supply: string;
  block_height: number;
  profile: {
    avatar: string;
    display_name: string;
    stats: {
      collection_created: number;
      nft_minted: number;
    };
  } | null;
};
