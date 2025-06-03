// /src/web/src/app/shared/intefaces/creationDate.ts

export interface YearRange {
    year_from: number;
    year_to: number;
}

export interface CreationDate {
    year_range: YearRange | null;
    year: number | null;
    month: number | null;
    day: number | null;
}