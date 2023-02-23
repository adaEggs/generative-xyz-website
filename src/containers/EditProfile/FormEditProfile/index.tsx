import Avatar from '@components/Avatar';
import ButtonIcon from '@components/ButtonIcon';
import Input from '@components/Formik/Input';
import ImagePreviewInput from '@components/ImagePreviewInput';
import Text from '@components/Text';
import { ROUTE_PATH } from '@constants/route-path';
import { WalletContext } from '@contexts/wallet-context';
import { LogLevel } from '@enums/log-level';
import { IUpdateProfilePayload } from '@interfaces/api/profile';
import { useAppDispatch, useAppSelector } from '@redux';
import { setUser } from '@redux/user/action';
import { getUserSelector } from '@redux/user/selector';
import { uploadFile } from '@services/file';
import { updateProfile } from '@services/profile';
import log from '@utils/logger';
import { validateBTCAddress } from '@utils/validate';
import { Formik } from 'formik';
import _isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import s from './styles.module.scss';
import { DEFAULT_USER_AVATAR } from '@constants/common';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';

const LOG_PREFIX = 'FormEditProfile';

const FormEditProfile = ({ tab = 'account' }: { tab: string }) => {
  const user = useAppSelector(getUserSelector);
  const [uploadError, setUploadError] = useState<boolean>(false);
  const route = useRouter();
  const dispatch = useAppDispatch();
  const walletCtx = useContext(WalletContext);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      await walletCtx.connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    }
  };

  const [newFile, setNewFile] = useState<File | null | undefined>();
  const isAccountTab = useMemo((): boolean => {
    return tab === 'account';
  }, [tab]);

  const validateForm = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    const twitterRegex = /^https?:\/\/twitter\.com\/[A-Za-z0-9_]{1,15}\/?$/;
    const httpsRegex = /^https:\/\//;

    if (values.twitter !== '' && !twitterRegex.test(values.twitter)) {
      errors.twitter = 'Invalid twitter link.';
    }

    if (
      !validateBTCAddress(values.walletAddressBtc) &&
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
    let avatarUrl = '';

    if (newFile) {
      const uploadRes = await uploadFile({ file: newFile });
      avatarUrl = uploadRes.url;
    } else if (uploadError) return;

    const payload: IUpdateProfilePayload = {
      avatar: avatarUrl || '',
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
        avatar: user?.avatar || DEFAULT_USER_AVATAR,
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
      {({ handleSubmit, isSubmitting, dirty, errors, values }) => (
        <form className={s.account}>
          {isAccountTab ? (
            <div className={s.account_form}>
              <div className={s.account_avatar}>
                <ImagePreviewInput
                  className={s.account_avatar_el}
                  file={values.avatar}
                  onFileChange={setNewFile}
                  onError={setUploadError}
                  previewHtml={<Avatar imgSrcs={values?.avatar} fill />}
                />
                {user?.avatar && (
                  <span className={s.account_avatar_label}>
                    <SvgInset
                      svgUrl={`${CDN_URL}/icons/camera-01.svg`}
                      size={24}
                    />
                  </span>
                )}
              </div>
              <div className={s.account_form_wrapper}>
                <div className={s.input_item}>
                  <Input
                    name={'nickname'}
                    label={'nickname'}
                    placeholder="Nickname"
                    className={s.input_nickname}
                    useFormik
                    errors={{ nickname: errors.nickname || '' }}
                  />
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
                  />
                </div>
                <div className={s.input_item}>
                  <div className={s.input_social}>
                    <Input
                      name={'website'}
                      label={'website'}
                      placeholder="https://"
                      className={s.input_website}
                      useFormik
                      errors={{ website: errors.website || '' }}
                    />
                    <Input
                      name={'twitter'}
                      label={'twitter'}
                      placeholder="https://twitter.com/..."
                      className={s.input_website}
                      errors={{ twitter: errors.twitter || '' }}
                      useFormik
                    />
                    <div className={s.submit_btn_lists}>
                      <ButtonIcon
                        onClick={() => handleSubmit()}
                        className={s.submit_btn}
                        disabled={
                          isSubmitting ||
                          (!dirty && !newFile) ||
                          !_isEmpty(errors)
                        }
                      >
                        Save changes
                      </ButtonIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={s.account_wallet}>
              {!!user?.walletAddressBtc && (
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
                  />
                </div>
              )}

              <div className={s.input_item}>
                <Input
                  name={'metamaskAddress'}
                  label={'Metamask wallet address'}
                  type="readonly"
                  disabled={true}
                  className={s.input_metamaskAddress}
                  defaultValue={user?.walletAddress}
                />
              </div>

              {!!user?.walletAddressBtcTaproot && (
                <div className={s.input_item}>
                  <Input
                    name={'metamaskAddress'}
                    label={'BTC wallet taproot wallet address'}
                    type="readonly"
                    disabled={true}
                    className={s.input_metamaskAddress}
                    defaultValue={user?.walletAddressBtcTaproot || ''}
                  />
                </div>
              )}

              <div className={s.account_wallet_action}>
                <div>
                  {user?.walletAddress ? (
                    <ButtonIcon
                      className={s.walletBtn}
                      variants={'secondary-2'}
                      onClick={() => {
                        walletCtx.disconnect();
                        route.replace(ROUTE_PATH.WALLET);
                      }}
                    >
                      Disconnect wallet
                    </ButtonIcon>
                  ) : (
                    <ButtonIcon
                      className={s.walletBtn}
                      variants={'secondary-2'}
                      onClick={handleConnectWallet}
                    >
                      Connect wallet
                    </ButtonIcon>
                  )}
                </div>
                <div>
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
          )}
        </form>
      )}
    </Formik>
  );
};

export default FormEditProfile;
