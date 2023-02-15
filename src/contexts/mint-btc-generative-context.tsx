import { MIN_MINT_BTC_PROJECT_PRICE } from '@constants/config';
import { CollectionType, MintGenerativeStep } from '@enums/mint-generative';
import { IBTCFormValue } from '@interfaces/mint-generative';
import {
  ImageCollectionFiles,
  ISandboxRef,
  RawTokenAttributes,
  SandboxFiles,
} from '@interfaces/sandbox';
import { getUserSelector } from '@redux/user/selector';
import { generateHash } from '@utils/generate-data';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useRef,
  useState,
  useMemo,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useSelector } from 'react-redux';

export type TMintBTCGenerativeContext = {
  currentStep: number;
  filesSandbox: SandboxFiles | null;
  setFilesSandbox: Dispatch<SetStateAction<SandboxFiles | null>>;
  attributes: RawTokenAttributes | null;
  setAttributes: Dispatch<SetStateAction<RawTokenAttributes | null>>;
  rawFile: File | null;
  setRawFile: Dispatch<SetStateAction<File | null>>;
  thumbnailFile: File | null;
  setThumbnailFile: Dispatch<SetStateAction<File | null>>;
  sandboxRef: RefObject<ISandboxRef | null>;
  hash: string;
  setHash: Dispatch<SetStateAction<string>>;
  formValues: Partial<IBTCFormValue>;
  setFormValues: Dispatch<SetStateAction<Partial<IBTCFormValue>>>;
  thumbnailPreviewUrl: string | null;
  setThumbnailPreviewUrl: Dispatch<SetStateAction<string | null>>;
  mintedProjectID: string | null;
  setMintedProjectID: Dispatch<SetStateAction<string | null>>;
  showErrorAlert: { open: boolean; message: string | null };
  setShowErrorAlert: Dispatch<
    SetStateAction<{ open: boolean; message: string | null }>
  >;
  collectionType: CollectionType;
  setCollectionType: Dispatch<SetStateAction<CollectionType>>;
  imageCollectionFile: ImageCollectionFiles | null;
  setImageCollectionFile: Dispatch<SetStateAction<ImageCollectionFiles | null>>;
};

const initialValues: TMintBTCGenerativeContext = {
  currentStep: 1,
  filesSandbox: null,
  setFilesSandbox: _ => {
    return;
  },
  attributes: null,
  setAttributes: _ => {
    return;
  },
  rawFile: null,
  setRawFile: _ => {
    return;
  },
  thumbnailFile: null,
  setThumbnailFile: _ => {
    return;
  },
  sandboxRef: React.createRef(),
  hash: '',
  setHash: _ => {
    return;
  },
  formValues: {},
  setFormValues: _ => {
    return;
  },
  thumbnailPreviewUrl: null,
  setThumbnailPreviewUrl: _ => {
    return;
  },
  mintedProjectID: null,
  setMintedProjectID: _ => {
    return;
  },
  showErrorAlert: { open: false, message: null },
  setShowErrorAlert: _ => {
    return;
  },
  collectionType: CollectionType.GENERATIVE,
  setCollectionType: _ => {
    return;
  },
  imageCollectionFile: null,
  setImageCollectionFile: _ => {
    return;
  },
};

export const MintBTCGenerativeContext =
  createContext<TMintBTCGenerativeContext>(initialValues);

export const MintBTCGenerativeContextProvider = ({
  children,
}: PropsWithChildren) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const { stepParam } = router.query;
  const [filesSandbox, setFilesSandbox] = useState<SandboxFiles | null>(null);
  const [imageCollectionFile, setImageCollectionFile] =
    useState<ImageCollectionFiles | null>(null);
  const [attributes, setAttributes] = useState<RawTokenAttributes | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const sandboxRef = useRef<ISandboxRef | null>(null);
  const [hash, setHash] = useState<string>(generateHash());
  const [formValues, setFormValues] = useState<Partial<IBTCFormValue>>({
    mintPrice: MIN_MINT_BTC_PROJECT_PRICE,
    creatorWalletAddress: user?.wallet_address_btc || '',
    royalty: 10,
  });
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  );
  const [mintedProjectID, setMintedProjectID] = useState<string | null>(null);
  const [collectionType, setCollectionType] = useState(
    CollectionType.GENERATIVE
  );
  const [showErrorAlert, setShowErrorAlert] = useState<{
    open: boolean;
    message: string | null;
  }>({ open: false, message: null });

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

  const currentStep = useMemo(() => {
    switch (stepParam) {
      case MintGenerativeStep.UPLOAD_PROJECT:
        return 1;

      case MintGenerativeStep.PROJECT_DETAIL:
        return 2;

      case MintGenerativeStep.SET_PRICE:
        return 3;

      case MintGenerativeStep.MINT_SUCCESS:
        return 4;

      default:
        return 1;
    }
  }, [stepParam]);

  return (
    <MintBTCGenerativeContext.Provider
      value={{
        currentStep,
        filesSandbox,
        setFilesSandbox,
        attributes,
        setAttributes,
        rawFile,
        setRawFile,
        thumbnailFile,
        setThumbnailFile,
        sandboxRef,
        hash,
        setHash,
        formValues,
        setFormValues,
        thumbnailPreviewUrl,
        setThumbnailPreviewUrl,
        mintedProjectID,
        setMintedProjectID,
        showErrorAlert,
        setShowErrorAlert,
        collectionType,
        setCollectionType,
        imageCollectionFile,
        setImageCollectionFile,
      }}
    >
      {children}
    </MintBTCGenerativeContext.Provider>
  );
};
