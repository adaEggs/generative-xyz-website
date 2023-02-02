interface IProp {
  el: HTMLDivElement | null;
  src: string;
}

export class Scrolly {
  DOM?: Record<string, HTMLDivElement>;
  // @ts-ignore
  scorlly?: any;

  constructor({ el, src }: IProp) {
    if (!el) return;
    this.DOM = { el };
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ScrollyVideo = require('scrolly-video/dist/ScrollyVideo').default;
    if (ScrollyVideo) {
      this.scorlly = new ScrollyVideo({
        scrollyVideoContainer: el,
        src: src,
        // debug: true,
      });
    }
  }

  destroy() {
    if (this.scorlly) {
      this.scorlly.destroy();
    }
  }
}
