export type Product = {
  eth_price: string;
  id: string;
  image: string;
  image_left: string;
  name: string;
  slug: string;
};

export interface IHardwareInfo {
  subtitle: string;
  title: string;
  icon: string;
}

export interface IHardwareItem {
  subtitle: string;
  title: string;
  desc: string;
  options: IHardwareInfo[];
  video?: string;
  poster?: string;
}
