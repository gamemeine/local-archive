export interface DataInstance {
  year: number;
  photo: string;
  month?: number;
  day?: number;
  location?: string;
  content?: string;
  postalCode?: string;
  private?: boolean;
}
