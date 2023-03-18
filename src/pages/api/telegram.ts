import type { NextApiRequest, NextApiResponse } from 'next';
import type { Row, WantedGigs } from 'typings/wantedGigs';

import { chromium } from 'playwright';

import {
  registChatRoomMessage,
  registMessage,
  registSuccessMessage,
} from 'constants/telegramMessages';

import cron from 'node-cron';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = process.env.TELEGRAM_TOKEN;

  const WANTED_API_URL = process.env.WANTED_API_URL;

  /**
   * 외주 알림 받게 될 채팅방 등록 및 알림 보내기
   */
  if (req.body.message?.text === '/outsourcing_notification_registration') {
    if (!process.env.USER_CHAT_ID) {
      process.env.USER_CHAT_ID = req.body.message.chat.id.toString();

      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${Number(
          process.env.USER_CHAT_ID,
        )}&parse_mode=HTML&&text=${registChatRoomMessage}`,
      );
    }

    cron.schedule('0 6,14 * * *', async () => {
      if (WANTED_API_URL) {
        const wantedGigs: WantedGigs = await fetch(WANTED_API_URL).then((res) =>
          res.json(),
        );

        const isWantedGisNewProject = wantedGigs.rows.filter(
          (gig) => gig.new_project,
        );

        const requestButton = (gig: any) => {
          return {
            inline_keyboard: [
              [
                {
                  text: '바로 지원하기 ➡️',
                  callback_data: JSON.stringify({
                    chatId: Number(process.env.USER_CHAT_ID),
                    projectId: gig.id,
                  }),
                },
              ],
            ],
          };
        };

        for (const gig of isWantedGisNewProject.slice(0, 1)) {
          await fetch(
            `https://api.telegram.org/bot${token}/sendMessage?chat_id=${Number(
              process.env.USER_CHAT_ID,
            )}&text=${registMessage(
              gig as Row,
            )}&parse_mode=HTML&reply_markup=${JSON.stringify(
              requestButton(gig),
            )}`,
          );
        }
      }
    });
  }
  /**
   * 외주 등록 알림 내 버튼 클릭 시 동작
   */
  if (req.body.callback_query?.data) {
    const {
      chatId,
      projectId,
    }: {
      chatId: number;
      projectId: Row['id'];
    } = JSON.parse(req.body.callback_query?.data);

    if (WANTED_API_URL) {
      const wantedGigs: WantedGigs = await fetch(WANTED_API_URL).then((res) =>
        res.json(),
      );

      const isWantedGisNewProject = wantedGigs.rows.filter(
        (gig) => gig.new_project && gig.id === projectId,
      );

      for (const gig of isWantedGisNewProject) {
        if (process.env.WANTED_EMAIL && process.env.WANTED_PASSWORD) {
          const browser = await chromium.launch({
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
            timeout: 60000,
          });

          const context = await browser.newContext({
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36',
          });

          const page = await context.newPage();

          await page.goto(`https://www.wanted.co.kr/gigs/projects/${gig.id}`, {
            timeout: 0,
          });

          await page.getByRole('button', { name: '로그인 하기' }).click();

          // 이메일 & 비밀번호 입력하기
          await page.getByTestId('Input_email').click();
          await page.getByTestId('Input_email').fill(process.env.WANTED_EMAIL);

          await page.getByTestId('Button').click();

          await page.getByTestId('Input_password').click();

          await page
            .getByTestId('Input_password')
            .fill(process.env.WANTED_PASSWORD);
          await page.getByRole('button', { name: 'Next' }).click();

          await page.getByRole('button', { name: '매칭 요청하기' }).click();

          // 한줄 소개 (타이틀) 입력하기
          await page
            .getByPlaceholder('예) 트렌드를 읽는 디자이너 김티드 입니다.')
            .click();

          await page
            .getByPlaceholder('예) 트렌드를 읽는 디자이너 김티드 입니다.')
            .fill(
              '스타트업 씬에서 근무한 4년차 프론트엔드 개발자 손지민입니다.',
            );

          // 견적 가격 작성하기 (현재는 최소 ~ 최대 입력)
          await page.locator('#advanced_search_salaryAmountStart').click();
          await page
            .locator('#advanced_search_salaryAmountStart')
            .fill(String(gig.salary.start));

          await page.locator('#advanced_search_salaryAmountEnd').click();
          await page
            .locator('#advanced_search_salaryAmountEnd')
            .fill(String(gig.salary.end));

          // 완료 버튼 클릭
          await page.getByRole('button', { name: '완료' }).click();

          // 크로미움 끝내기
          await context.close();
          await browser.close();

          // 지원 완료 텍스트 보내기
          await fetch(
            `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${registSuccessMessage(
              gig as Row,
            )}&parse_mode=HTML`,
          );
        } else {
          throw new Error('WANTED Email or Password is not defined');
        }
      }
    }
  }
  res.status(200).send('OK');
};
