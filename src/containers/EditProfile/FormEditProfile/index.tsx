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
import { getUserSelector } from '@redux/user/selector';
import { updateProfile } from '@services/profile';
import { formatAddress, toBase64 } from '@utils/format';
import log from '@utils/logger';
import { Formik } from 'formik';
import { useContext, useState } from 'react';
import s from './styles.module.scss';
import { setUser } from '@redux/user/action';

const LOG_PREFIX = 'FormEditProfile';

const FormEditProfile = () => {
  const user = useAppSelector(getUserSelector);
  const dispatch = useAppDispatch();

  const walletCtx = useContext(WalletContext);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      await walletCtx.connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.Debug, LOG_PREFIX);
    }
  };

  const text = user.avatar.replace('data:image/png;base64,', '');
  const file = URL.createObjectURL(new Blob([text], { type: 'image/png' }));

  const [avatar] = useState(file);

  const [newFile, setNewFile] = useState<File | null | undefined>();

  const handleSubmit = async (values: any) => {
    const payload: IUpdateProfilePayload = {
      avatar: newFile ? await toBase64(newFile) : '',
      bio: values.bio || '',
      displayName: values.nickname,
      profileSocial: {
        web: values.website || '',
        twitter: values.twitter || '',
        discord: values.discord || '',
        instagram: values.instagram || '',
      },
    };

    const res = await updateProfile(payload);
    if (res) dispatch(setUser(res));

    try {
      return;
    } catch (err: unknown) {
      log('Not implemented ', LogLevel.Error, LOG_PREFIX);
    }
  };

  return (
    <Formik
      key="listingForm"
      initialValues={{
        nickname: user.displayName || '',
        bio: user.bio || '',
        avatar: avatar || '',
        website: user.profileSocial?.web || '',
        instagram: user.profileSocial?.instagram || '',
        discord: user.profileSocial?.discord || '',
        twitter: user.profileSocial?.twitter || '',
      }}
      // validate={validateForm}
      onSubmit={handleSubmit}
      validateOnChange
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting, dirty }) => (
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
                  ></Input>
                  <Input
                    name={'instagram'}
                    label={'instagram'}
                    placeholder="Instagram"
                    className={s.input_website}
                    useFormik
                  ></Input>
                  <Input
                    name={'discord'}
                    label={'discord'}
                    placeholder="Discord"
                    className={s.input_website}
                    useFormik
                  ></Input>
                  <Input
                    name={'twitter'}
                    label={'twitter'}
                    placeholder="Twitter"
                    className={s.input_website}
                    useFormik
                  ></Input>
                  <ButtonIcon
                    onClick={() => handleSubmit()}
                    className={s.submit_btn}
                    disabled={isSubmitting || (!dirty && !newFile)}
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
            <Text style={{ marginBottom: '6px' }}>
              Your wallet address {formatAddress(user?.walletAddress || '')}
            </Text>
            {user?.walletAddress ? (
              <ButtonIcon onClick={() => walletCtx.disconnect()}>
                Disconnect wallet
              </ButtonIcon>
            ) : (
              <ButtonIcon onClick={handleConnectWallet}>
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