import s from './styles.module.scss';
import ButtonIcon from '@components/ButtonIcon';
import Skeleton from '@components/Skeleton';
import Text from '@components/Text';
import { CDN_URL, GENERATIVE_EXPLORER_URL } from '@constants/config';
import { PreviewDisplayMode } from '@enums/mint-generative';
import { ISandboxRef } from '@interfaces/sandbox';
import { Token } from '@interfaces/token';
import { generateHash } from '@utils/generate-data';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Project } from '@interfaces/project';
import PreviewController from './PreviewController';
import IFramePreview from './IframePreview';
import { useRouter } from 'next/router';

type Props = {
  data: Token | Project | null;
  allowVariantion?: boolean;
  isBitcoinProject?: boolean;
  previewToken?: boolean;
};

const ThumbnailPreview = (props: Props) => {
  const { data, allowVariantion = false, previewToken = false } = props;
  const router = useRouter();
  const { projectID } = router.query;
  const animationUrl =
    (data as Token)?.animationUrl || (data as Token)?.animation_url || '';
  const sandboxRef = useRef<ISandboxRef>(null);
  const [displayMode, setDisplayMode] = useState<PreviewDisplayMode>();
  const [hash, setHash] = useState<string>(generateHash());
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleIframeLoaded = (): void => {
    if (sandboxRef.current) {
      const iframe = sandboxRef.current.getHtmlIframe();
      if (iframe) {
        // @ts-ignore: Allow read iframe's window object
        setPreviewSrc(iframe.src);
      }
    }
  };

  const reloadIframe = (): void => {
    if (sandboxRef.current) {
      sandboxRef.current.reloadIframe();
    }
  };

  const handlePlay = (): void => {
    setDisplayMode(PreviewDisplayMode.ANIMATION);
  };

  const handlePause = (): void => {
    setDisplayMode(PreviewDisplayMode.THUMBNAIL);
  };

  const handleVariation = (): void => {
    setHash(generateHash());
  };

  const canPlay = useMemo(() => {
    return !!animationUrl && displayMode === PreviewDisplayMode.THUMBNAIL;
  }, [animationUrl, displayMode]);

  const canPause = useMemo(() => {
    return !!animationUrl && displayMode === PreviewDisplayMode.ANIMATION;
  }, [animationUrl, displayMode]);

  const openPreview = useMemo(() => !!previewSrc, [previewSrc]);

  const previewUrl = useMemo((): string => {
    if (previewToken) {
      return `${GENERATIVE_EXPLORER_URL}?projectId=${projectID}&tokenId=${data?.tokenID}&seed=${data?.tokenID}`;
    }
    return `${GENERATIVE_EXPLORER_URL}?projectId=${projectID}&seed=${hash}`;
  }, [projectID, data, hash]);

  useEffect(() => {
    if (animationUrl) {
      setDisplayMode(PreviewDisplayMode.ANIMATION);
    } else {
      setDisplayMode(PreviewDisplayMode.THUMBNAIL);
    }
  }, [animationUrl]);

  return (
    <div className={s.ThumbnailPreview}>
      <div className={s.wrapper}>
        <div className={s.sandboxWrapper}>
          <Skeleton fill isLoaded={!!data} />
          {data && (
            <>
              {displayMode === PreviewDisplayMode.ANIMATION && (
                <div className={s.sandboxContent}>
                  <IFramePreview
                    ref={sandboxRef}
                    url={previewUrl}
                    onLoaded={handleIframeLoaded}
                  ></IFramePreview>
                </div>
              )}
              {displayMode === PreviewDisplayMode.THUMBNAIL && (
                <PreviewController data={data} />
              )}
            </>
          )}
        </div>
        {animationUrl && (
          <div className={s.actionWrapper}>
            <div className={s.sandboxControls}>
              {allowVariantion &&
                displayMode === PreviewDisplayMode.ANIMATION && (
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip id="variation-tooltip">
                        <Text
                          size="14"
                          fontWeight="semibold"
                          color="primary-333"
                        >
                          Variation
                        </Text>
                      </Tooltip>
                    }
                  >
                    <ButtonIcon
                      onClick={handleVariation}
                      className={s.actionBtn}
                      sizes="mid"
                      variants="outline"
                      iconOnly
                    >
                      <Image
                        alt="play icon"
                        width={16}
                        height={16}
                        src={`${CDN_URL}/icons/ic-shuffle-24x24.svg`}
                      ></Image>
                    </ButtonIcon>
                  </OverlayTrigger>
                )}
              {canPlay && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip id="play-tooltip">
                      <Text size="14" fontWeight="semibold" color="primary-333">
                        Play
                      </Text>
                    </Tooltip>
                  }
                >
                  <ButtonIcon
                    onClick={handlePlay}
                    className={s.actionBtn}
                    sizes="mid"
                    variants="outline"
                    iconOnly
                  >
                    <Image
                      alt="play icon"
                      width={16}
                      height={16}
                      src={`${CDN_URL}/icons/ic-play-14x14.svg`}
                    ></Image>
                  </ButtonIcon>
                </OverlayTrigger>
              )}
              {canPause && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip id="pause-tooltip">
                      <Text size="14" fontWeight="semibold" color="primary-333">
                        Pause
                      </Text>
                    </Tooltip>
                  }
                >
                  <ButtonIcon
                    onClick={handlePause}
                    className={s.actionBtn}
                    sizes="mid"
                    variants="outline"
                    iconOnly
                  >
                    <Image
                      alt="pause icon"
                      width={16}
                      height={16}
                      src={`${CDN_URL}/icons/ic-pause-14x14.svg`}
                    ></Image>
                  </ButtonIcon>
                </OverlayTrigger>
              )}
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip id="reload-tooltip">
                    <Text size="14" fontWeight="semibold" color="primary-333">
                      Reload
                    </Text>
                  </Tooltip>
                }
              >
                <ButtonIcon
                  onClick={reloadIframe}
                  className={s.actionBtn}
                  sizes="mid"
                  variants="outline"
                  iconOnly
                >
                  <Image
                    alt="refresh icon"
                    width={16}
                    height={16}
                    src={`${CDN_URL}/icons/ic-refresh-14x14.svg`}
                  ></Image>
                </ButtonIcon>
              </OverlayTrigger>

              {openPreview && previewSrc && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip id="expand-tooltip">
                      {' '}
                      <Text size="14" fontWeight="semibold" color="primary-333">
                        Expand
                      </Text>
                    </Tooltip>
                  }
                >
                  <Link href={previewSrc} target="_blank">
                    <ButtonIcon
                      className={s.actionBtn}
                      sizes="mid"
                      variants="outline"
                      iconOnly
                    >
                      <Image
                        alt="pause icon"
                        width={16}
                        height={16}
                        src={`${CDN_URL}/icons/ic-expand.svg`}
                      ></Image>
                    </ButtonIcon>
                  </Link>
                </OverlayTrigger>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailPreview;
