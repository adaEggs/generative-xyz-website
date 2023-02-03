import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import s from './styles.module.scss';
import dynamic from 'next/dynamic';
import React, { ChangeEvent } from 'react';
import cs from 'classnames';
import { ContextStore, MDEditorProps } from '@uiw/react-md-editor';
const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then(mod => mod.default),
  { ssr: false }
);

interface IProps extends MDEditorProps {
  value: string;
  onValueChange: (
    value?: string | undefined,
    event?: ChangeEvent<HTMLTextAreaElement> | undefined,
    state?: ContextStore | undefined
  ) => void;
}

const MarkdownEditor: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { value, onValueChange, className, ...delegatedProps } = props;

  return (
    <MDEditor
      className={cs(s.markdownEditor, className)}
      value={value}
      onChange={onValueChange}
      {...delegatedProps}
    />
  );
};

export default MarkdownEditor;
