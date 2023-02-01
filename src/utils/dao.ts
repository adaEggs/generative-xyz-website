import DAOTresuryContractABI from '@services/contract-abis/gen-dao-treasury.json';

export const getTreasuryFunctionsFromABI = (): Array<string> => {
  const { abi } = DAOTresuryContractABI;

  return (
    abi
      .filter(
        abiItem =>
          abiItem.type === 'function' &&
          abiItem.name &&
          !abiItem.name.startsWith('_')
      )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(abiItem => abiItem.name!)
  );
};
