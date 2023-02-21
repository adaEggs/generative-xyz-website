import { MintGenerativeStep } from '@enums/mint-generative';
import { IMintStep } from '@interfaces/mint-generative';

export const MINT_STEPS: Array<IMintStep> = [
  {
    path: MintGenerativeStep.UPLOAD_PROJECT,
    stepIndex: 1,
    title: 'Submit your collection',
  },
  {
    path: MintGenerativeStep.PROJECT_DETAIL,
    stepIndex: 2,
    title: 'Collection information',
  },
  {
    path: MintGenerativeStep.SET_PRICE,
    stepIndex: 3,
    title: 'Pricing and publishing',
  },
];

export const THIRD_PARTY_SCRIPTS = [
  {
    label: 'p5js@1.5.0',
    value: 'p5js@1.5.0',
    script:
      '<script sandbox="allow-scripts" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.min.js"></script>',
  },
  {
    label: 'threejs@r124',
    value: 'threejs@r124',
    script:
      '<script sandbox="allow-scripts allow-pointer-lock" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r124/three.min.js"></script>',
  },
  {
    label: 'tonejs@14.8.49',
    value: 'tonejs@14.8.49',
    script:
      '<script sandbox="allow-scripts" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>',
  },
  {
    label: 'c2.min.js@1.0.0',
    value: 'c2.min.js@1.0.0',
    script:
      '<script sandbox="allow-scripts" type="text/javascript" src="https://cdn.generative.xyz/ajax/libs/c2/1.0.0/c2.min.js"></script>',
  },
  {
    label: 'chromajs@2.4.2',
    value: 'chromajs@2.4.2',
    script:
      '<script sandbox="allow-scripts" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js"></script>',
  },
  {
    label: 'p5.grain.js@0.6.1',
    value: 'p5.grain.js@0.6.1',
    script:
      '<script sandbox="allow-scripts" type="text/javascript" src="https://cdn.generative.xyz/ajax/libs/p5.grain/0.6.1/p5.grain.min.js"></script>',
  },
];

export const LICENSE_OPTIONS = [];
