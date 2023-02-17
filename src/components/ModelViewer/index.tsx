/* eslint-disable @typescript-eslint/no-explicit-any */
import '@google/model-viewer';

import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const ModelViewer = React.forwardRef((props: any, ref): JSX.Element => {
  const [id] = React.useState(uuidv4());

  return <model-viewer {...props} id={props.id || id} ref={ref} />;
});

ModelViewer.displayName = 'ModelViewer';
export default ModelViewer;
