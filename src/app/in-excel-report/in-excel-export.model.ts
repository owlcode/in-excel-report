export interface ReportConfig {
  client: string;
  user: string;
}

export interface IReportEntry {
  client: string;
  project: string;
  isInternal: boolean;
  hours: number | string;
  selectedDays: Set<string>;
}

export interface WorkingDay {
  date: string;
  hours: number | string;
}
