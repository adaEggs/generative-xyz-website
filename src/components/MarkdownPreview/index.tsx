import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import React from 'react';
import { MarkdownPreviewProps } from '@uiw/react-markdown-preview';
const MDPreview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then(mod => mod.default),
  { ssr: false }
);

const MarkdownPreview: React.FC<MarkdownPreviewProps> = (
  props: MarkdownPreviewProps
): React.ReactElement => {
  return <MDPreview {...props} />;
};

export default MarkdownPreview;
