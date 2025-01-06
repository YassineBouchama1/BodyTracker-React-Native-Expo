export interface ProgressPhoto {
    id: string;
    uri: string;
    date: Date;
    week: number;
    filters?: ImageFilter[];
  }


  export interface ImageFilter {
    type: 'brightness' | 'contrast' | 'blackAndWhite';
    value: number;
  }