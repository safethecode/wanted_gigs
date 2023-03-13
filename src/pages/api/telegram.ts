import { NextApiRequest, NextApiResponse } from 'next';

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;

  if (req.body.message?.text === '/start') {
    const wantedGigs: WantedGigs = await fetch(
      'https://www.wanted.co.kr/gigs/api-v2/projects?page=1&work_type_office=true&work_type_remote=true&sort=createdAt&job_industry=518&skills=&is_recruiting=true',
    ).then((res) => res.json());

    const isWantedGisNewProject = wantedGigs.rows.filter(
      (gig) => gig.new_project,
    );

    if (isWantedGisNewProject.length > 0) {
      const message = isWantedGisNewProject
        .map(
          (gig) =>
            `New Project: ${
              gig.titleDisplay
            }%0A${`https://www.wanted.co.kr/gigs/projects/${gig.id}`}%0A가격: ${
              gig.salary.start
            } ~ ${gig.salary.end}%0A기간: ${gig.term.start} ~ ${
              gig.term.end
            }%0A근무 형태: ${gig.work_place_txt}`,
        )
        .join('%0A%0A');

      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${req.body.message.chat.id}&text=${message}&parse_mode=HTML`,
      );
    }
  }
  if (req.body.message?.text === '/alive') {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${req.body.message.chat.id}&text=I'm alive!`,
    );
  }
  res.status(200).send('OK');
};
