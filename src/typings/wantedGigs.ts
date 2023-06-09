export interface WantedGigs {
  status: string;
  rows: Row[];
  count: Count;
}

export interface Count {
  total: number;
  page: number;
  pages: number;
}

export interface Row {
  id: number;
  title: string;
  titleDisplay: string;
  work_type: null | string;
  work_place: WorkPlace;
  work_place_txt: WorkPlaceTxt;
  salary: Salary;
  startAt: Date;
  negotiable_start: boolean;
  address: null | string;
  text_work_place: string;
  term: Term;
  text_term_type: TextTermType;
  text_salary_type: TextSalaryType;
  apply_count: number;
  count_matches: number;
  directApplyCount: number;
  clientSuggestAcceptCount: number;
  managerSuggestAcceptCount: number;
  is_suggest: null;
  jobs: string;
  skills: string;
  new_project: boolean;
  match_id: null;
  match_status_expert: string;
  is_recruiting: boolean;
  is_bookmark: boolean;
  jobsV2: JobsV2[];
}

export interface JobsV2 {
  jobIndustryId: number;
  jobIndustryTitle: JobIndustryTitle;
  jobCategoryId: number;
  jobCategoryTitle: string;
}

export enum JobIndustryTitle {
  개발 = '개발',
}

export interface Salary {
  salary_type: SalaryType;
  start: number;
  end: number;
}

export enum SalaryType {
  All = 'all',
  Monthly = 'monthly',
}

export interface Term {
  term_type: TermType;
  start: number;
  end: number | null;
}

export enum TermType {
  Monthly = 'monthly',
  Weekly = 'weekly',
}

export enum TextSalaryType {
  월급 = '월급',
  프로젝트전체 = '프로젝트 전체',
}

export enum TextTermType {
  개월 = '개월',
  주 = '주',
}

export enum WorkPlace {
  Both = 'both',
  Office = 'office',
  Remote = 'remote',
}

export enum WorkPlaceTxt {
  상주 = '상주',
  원격 = '원격',
  원격상주 = '원격/상주',
}
