import s from './styles.module.scss';
import SandboxPreview from '@components/SandboxPreview';
import ClientOnly from '@components/Utils/ClientOnly';
import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
import { LogLevel } from '@enums/log-level';
import { getProjectDetail } from '@services/project';
import { base64ToUtf8, escapeSpecialChars } from '@utils/format';
import { generateHash } from '@utils/generate-data';
import { checkIsBitcoinProject } from '@utils/generative';
import log from '@utils/logger';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { getTokenUri } from '@services/token-uri';
import { Loading } from '@components/Loading';
import PreviewController from '@components/ThumbnailPreview/PreviewController';
import { Token } from '@interfaces/token';
import { Project } from '@interfaces/project';

const LOG_PREFIX = 'GenerativeExplore';

const GenerativeExplore: React.FC = (): React.ReactElement => {
  const router = useRouter();
  const isReady = router.isReady;
  const { projectId, tokenId, seed = generateHash() } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [rawHTML, setRawHTML] = useState<string>('');
  const [data, setData] = useState<Token | Project | null>(null);

  const handleGetProjectPreview = async () => {
    try {
      const project = await getProjectDetail({
        contractAddress: GENERATIVE_PROJECT_CONTRACT,
        projectID: projectId as string,
      });
      if (!project) return;

      setData(project);
      const _projectDetail = base64ToUtf8(
        project.projectURI.replace('data:application/json;base64,', '')
      );
      if (_projectDetail) {
        let projectDetailJSON = _projectDetail;
        if (!checkIsBitcoinProject(project.tokenID)) {
          projectDetailJSON = escapeSpecialChars(_projectDetail);
        }
        const projectDetailObj = JSON.parse(projectDetailJSON);
        const animationUrl =
          projectDetailObj.animationUrl || projectDetailObj.animation_url || '';
        const html = base64ToUtf8(
          animationUrl.replace('data:text/html;base64,', '')
        );
        setRawHTML(html);
        setIsLoading(false);
      }
    } catch (_: unknown) {
      log('failed to fetch project detail data', LogLevel.ERROR, LOG_PREFIX);
      setHasError(true);
    }
  };

  const handleGetTokenPreview = useCallback(async () => {
    try {
      const res = await getTokenUri({
        contractAddress: GENERATIVE_PROJECT_CONTRACT,
        tokenID: tokenId as string,
      });
      const animationUrl = res.animationUrl || res.animation_url || '';
      const html = base64ToUtf8(
        animationUrl.replace('data:text/html;base64,', '')
      );
      setRawHTML(html);
      setData(res);
      setIsLoading(false);
    } catch (_: unknown) {
      log('failed to fetch token detail data', LogLevel.ERROR, LOG_PREFIX);
      setHasError(true);
    }
  }, [tokenId]);

  useEffect(() => {
    if (!isReady) return;
    if (projectId && !tokenId) {
      handleGetProjectPreview();
    } else if (projectId && tokenId) {
      handleGetTokenPreview();
    }
  }, [isReady, projectId, tokenId]);

  return (
    <ClientOnly>
      <div className={s.generativeExplore}>
        {isLoading ? (
          <Loading isLoaded={false} />
        ) : (
          <>
            {hasError ? (
              <div className={s.errorWrapper}>
                <p className={s.errorMessage}>An error occurred!</p>
              </div>
            ) : (
              <>
                {rawHTML ? (
                  <SandboxPreview
                    showIframe={true}
                    rawHtml={rawHTML}
                    hash={(tokenId ? tokenId : seed) as string}
                    sandboxFiles={null}
                    className={s.thumbnailIframe}
                  />
                ) : (
                  <PreviewController data={data} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </ClientOnly>
  );
};

export default GenerativeExplore;
