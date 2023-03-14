export enum InscribeMintFeeRate {
  ECONOMY = 15,
  FASTER = 20,
  FASTEST = 25,
}

export enum InscribeStatus {
  Pending, // 0: pending: waiting for fund
  ReceivedFund, // 1: received fund from user (buyer)
  SendingBTCFromSegwitAddrToOrdAddr, // 2: sending btc from segwit address to ord address
  SentBTCFromSegwitAddrToOrdAdd, // 3: send btc from segwit address to ord address success
  Minting, // 4: minting
  Minted, // 5: mint success
  SendingNFTToUser, // 6: sending nft to user
  SentNFTToUser, // 7: send nft to user success: flow DONE
  TxSendBTCFromSegwitAddrToOrdAddrFailed, // 8: send btc from segwit address to ord address failed
  TxSendBTCToUserFailed, // 9: send nft to user failed
  TxMintFailed, // 10: tx mint failed
  NotEnoughBalance, // 11: balance not enough
  NeedToRefund, // 12: Need to refund BTC
}
