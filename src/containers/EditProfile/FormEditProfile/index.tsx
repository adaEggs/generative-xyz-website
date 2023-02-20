import Avatar from '@components/Avatar';
import ButtonIcon from '@components/ButtonIcon';
import Input from '@components/Formik/Input';
import Heading from '@components/Heading';
import ImagePreviewInput from '@components/ImagePreviewInput';
import Skeleton from '@components/Skeleton';
import Text from '@components/Text';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import { IUpdateProfilePayload } from '@interfaces/api/profile';
import { useAppDispatch, useAppSelector } from '@redux';
import { setUser } from '@redux/user/action';
import { getUserSelector } from '@redux/user/selector';
import { updateProfile } from '@services/profile';
import { toBase64 } from '@utils/format';
import log from '@utils/logger';
import { Formik } from 'formik';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import s from './styles.module.scss';
import { validateBTCWalletAddress } from '@utils/validate';
import _isEmpty from 'lodash/isEmpty';

const LOG_PREFIX = 'FormEditProfile';

const FormEditProfile = () => {
  const user = useAppSelector(getUserSelector);
  const dispatch = useAppDispatch();
  const walletCtx = useContext(WalletContext);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      await walletCtx.connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    }
  };

  const text = user?.avatar.replace('data:image/png;base64,', '') ?? '';
  const file = URL.createObjectURL(new Blob([text], { type: 'image/png' }));

  const [avatar] = useState(file);

  const [newFile, setNewFile] = useState<File | null | undefined>();

  const validateForm = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    const twitterRegex = /^https?:\/\/twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/;
    const httpsRegex = /^https:\/\//;

    if (values.twitter !== '' && !twitterRegex.test(values.twitter)) {
      errors.twitter = 'Invalid twitter link.';
    }

    if (
      !validateBTCWalletAddress(values.walletAddressBtc) &&
      values.walletAddressBtc !== ''
    ) {
      errors.walletAddressBtc = 'Invalid wallet address.';
    }

    if (!httpsRegex.test(values.website) && values.website !== '') {
      errors.website = 'Invalid website link.';
    }

    return errors;
  };

  const handleSubmit = async (values: Record<string, string>) => {
    const payload: IUpdateProfilePayload = {
      avatar: newFile ? await toBase64(newFile) : '',
      bio: values.bio || '',
      displayName: values.nickname,
      profileSocial: {
        web: values.website || '',
        twitter: values.twitter || '',
        discord: values.discord || '',
        instagram: values.instagram || '',
        etherScan: values.etherScan || '',
      },
      walletAddressBtc: values.walletAddressBtc || '',
    };

    const res = await updateProfile(payload);
    if (res) {
      dispatch(setUser(res));
      toast.success('Update successfully');
    }

    try {
      return;
    } catch (err: unknown) {
      log('Failed to update profile ', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  return (
    <Formik
      key="listingForm"
      initialValues={{
        nickname: user?.displayName || '',
        bio: user?.bio || '',
        avatar: avatar || '',
        website: user?.profileSocial?.web || '',
        instagram: user?.profileSocial?.instagram || '',
        discord: user?.profileSocial?.discord || '',
        etherScan: user?.profileSocial?.etherScan || '',
        twitter: user?.profileSocial?.twitter || '',
        walletAddressBtc: user?.walletAddressBtc || '',
      }}
      validate={validateForm}
      onSubmit={handleSubmit}
      validateOnChange
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting, dirty, errors }) => (
        <form className={s.account}>
          <div className={s.account_avatar}>
            <ImagePreviewInput
              file={avatar}
              onFileChange={setNewFile}
              previewHtml={
                user?.avatar ? (
                  <Avatar imgSrcs={user?.avatar || ''} fill />
                ) : (
                  <Skeleton fill></Skeleton>
                )
              }
            />
            {user?.avatar && (
              <ButtonIcon
                variants="secondary"
                className={s.change_btn}
                style={{ pointerEvents: 'none' }}
              >
                Changes
              </ButtonIcon>
            )}
          </div>
          <div className={s.account_form}>
            <Heading as="h4" fontWeight="bold">
              Account Info
            </Heading>
            <div className={s.account_form_wrapper}>
              <div className={s.input_item}>
                <Input
                  name={'nickname'}
                  label={'nickname'}
                  placeholder="Nickname"
                  className={s.input_nickname}
                  useFormik
                  errors={{ nickname: errors.nickname || '' }}
                ></Input>
                <Text size="14" className="text-secondary-color">
                  Other users will see your nickname instead of your wallet
                  address.
                </Text>
              </div>
              <div className={s.input_item}>
                <Input
                  placeholder="Tell us more about yourself"
                  name={'bio'}
                  label={'bio'}
                  className={s.input_bio}
                  as="textarea"
                  errors={{ bio: errors.bio || '' }}
                  useFormik
                ></Input>
              </div>
              <div className={s.input_item}>
                <Input
                  name={'walletAddressBtc'}
                  label={'BTC Wallet Address'}
                  placeholder="3FZb..."
                  className={s.input_wallet}
                  errors={{
                    walletAddressBtc: errors.walletAddressBtc || '',
                  }}
                  useFormik
                ></Input>
              </div>

              <div className={s.input_item}>
                <Text
                  size="18"
                  fontWeight="bold"
                  style={{ marginBottom: '10px' }}
                >
                  Social Connections
                </Text>
                <div className={s.input_social}>
                  <Input
                    name={'website'}
                    label={'website'}
                    placeholder="https://"
                    className={s.input_website}
                    useFormik
                    errors={{ website: errors.website || '' }}
                  ></Input>
                  {/* <Input
                    name={'instagram'}
                    label={'instagram'}
                    placeholder="Instagram"
                    className={s.input_website}
                    useFormik
                  ></Input> */}
                  {/* <Input
                    name={'discord'}
                    label={'discord'}
                    placeholder="Discord"
                    className={s.input_website}
                    useFormik
                  ></Input> */}
                  {/* <Input
                    name={'etherScan'}
                    label={'etherScan'}
                    placeholder="Etherscan"
                    className={s.input_website}
                    useFormik
                  ></Input> */}
                  <Input
                    name={'twitter'}
                    label={'twitter'}
                    placeholder="https://twitter.com/..."
                    className={s.input_website}
                    errors={{ twitter: errors.twitter || '' }}
                    useFormik
                  ></Input>
                  <ButtonIcon
                    onClick={() => handleSubmit()}
                    className={s.submit_btn}
                    disabled={
                      isSubmitting || (!dirty && !newFile) || !_isEmpty(errors)
                    }
                  >
                    Save changes
                  </ButtonIcon>
                </div>
              </div>
            </div>
          </div>
          <div className={s.account_wallet}>
            <Heading as="h4" fontWeight="bold">
              Wallet
            </Heading>
            <Text>Metamask wallet address:</Text>
            <Text style={{ marginBottom: '6px' }}>
              {user?.walletAddress || ''}
            </Text>
            {!!user?.walletAddressBtc && (
              <>
                <Text>BTC wallet address:</Text>
                <Text style={{ marginBottom: '6px' }}>
                  {user?.walletAddressBtc || ''}
                </Text>
              </>
            )}
            {user?.walletAddress ? (
              <ButtonIcon
                className={s.walletBtn}
                onClick={() => walletCtx.disconnect()}
              >
                Disconnect wallet
              </ButtonIcon>
            ) : (
              <ButtonIcon className={s.walletBtn} onClick={handleConnectWallet}>
                Connect wallet
              </ButtonIcon>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormEditProfile;
