// /src/web/src/app/shared/intefaces/dataInstance.ts

export interface DataInstance {
  year: number;
  photo: string;
  month?: number;
  day?: number;
  location?: string;
  content?: string;
  postalCode?: string;
  private?: boolean;
  id: string;
}
