export interface Photo {
  id: string;
  description: string;
  urls: {
    small: string;
  };
  width: number;
  height: number;
  isVisible: boolean;
}
