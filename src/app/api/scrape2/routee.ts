export const maxDuration = 300;

import { headers as nextHeaders } from 'next/headers';
import { userAgent as userAgentNext } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

import decryptData from '@/actions/decryptData';
import puppeteerConfig from '@/config/puppeteerConfig';
import createUser from '@/db/actions/user/createUser';
import ScrapeError from '@/errors/scrapeError';
import capsolver from '@/functions/capsolver';
import UserProtocol from '@/interfaces/userProtocol';

interface BodyParams {
  user?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  const headers = await nextHeaders();
  const realUserAgent = userAgentNext({ headers }).ua;
  const { page, browser } = await puppeteerConfig({ userAgent: realUserAgent });

  try {
    const authorization = req.headers.get('authorization') ?? '';
    const isAuthorized = await decryptData(authorization);
    if (!isAuthorized) {
      throw new ScrapeError('Você não tem esse poder comédia', 401);
    }

    const body: BodyParams = await req.json();
    let { user, password } = body;
    if (!user || !password) {
      throw new ScrapeError('Parâmetros de requisição inválidos', 401);
    }
    console.warn(body);

    // Escuta todas as respostas
    let dataAuth: any = null;
    let dataDebts: any = null;
    let dataInstallations: any = null;
    page.on('response', async response => {
      try {
        const request = response.request();
        const url = response.url();
        if (url.includes('/portal/api/auth/session')) {
          dataAuth = await response.json();
          dataAuth = dataAuth.data.user;
        }

        if (request.method() === 'POST') {
          const postData = request.postData();
          if (postData && postData.includes('"operationName":"DebtsV2"')) {
            dataDebts = await response.json();
            dataDebts = dataDebts.data.debtsV2.bills;
          }
        }

        if (request.method() === 'POST') {
          const postData = request.postData();
          if (
            postData &&
            postData.includes('"operationName":"SiteListByBusinessPartnerV2"')
          ) {
            dataInstallations = await response.json();
            dataInstallations =
              dataInstallations.data.siteListByBusinessPartnerV2.sites;
          }
        }
      } catch (err) {
        console.error('Erro:', err);
      }
    });

    await page.goto('https://atende.cemig.com.br/Login', {
      waitUntil: 'load',
    });

    try {
      const rejectCookiesSelector = '#onetrust-reject-all-handler';
      await page.waitForSelector(rejectCookiesSelector, { timeout: 2000 });
      await page.click(rejectCookiesSelector);
    } catch {} // eslint-disable-line

    const userSelector = '#acesso';
    await page.waitForSelector(userSelector);
    await page.focus(userSelector);
    await page.type(userSelector, user, { delay: 10 });

    const passwordSelector = '#senha';
    await page.waitForSelector(passwordSelector);
    await page.focus(passwordSelector);
    await page.type(passwordSelector, password, { delay: 10 });

    const token = await capsolver();
    if (!token) throw new ScrapeError('Ocorreu um erro, tente novamente', 401);

    await page.evaluate(token => {
      // const form = document.querySelector<HTMLFormElement>('#frmLogin');
      const btn = document.querySelector<HTMLButtonElement>('#submitForm');
      const textarea = document.querySelector<HTMLTextAreaElement>(
        '#g-recaptcha-response'
      );
      if (btn && textarea && token) {
        textarea.value = token;
        btn.click();
      }
    }, token);

    const start = Date.now();
    const maxTime = 30000;
    const interval = 1000;

    while (true) {
      if (dataAuth && dataDebts && dataInstallations) {
        break;
      }
      // se passou do tempo máximo, encerra retornando null
      if (Date.now() - start > maxTime) {
        break;
      }
      // espera antes de checar de novo
      await new Promise(res => setTimeout(res, interval));
    }

    let data: Omit<UserProtocol, '_id' | 'createdIn'> = {
      userLogin: user,
      password,
      idDocument: dataAuth.document.replace(/[^\d]/g, ''),
      name: dataAuth.name,
      email: dataAuth.email,
      phone: dataAuth.phone.replace(/[^\d]/g, ''),
      installations: dataInstallations.map((itemInstallations: any) => ({
        siteNumber: itemInstallations.siteNumber,
        status: itemInstallations.status,
        address: itemInstallations.address,
        contract: itemInstallations.contract,
        contractAccount: itemInstallations.contractAccount,
        debts: dataDebts
          .filter(
            (itemDebts: any) =>
              itemDebts.site.siteNumber === itemInstallations.siteNumber
          )
          .map((itemDebts: any) => ({
            documentContractAccount: itemDebts.documentContractAccount,
            dueDate: itemDebts.dueDate,
            referenceMonth: itemDebts.referenceMonth,
            status: itemDebts.status,
            value: itemDebts.value,
          })),
      })),
    };

    const userId = await createUser(data);

    return NextResponse.json({
      success: true,
      data: { userId, installationId: data.installations[0].siteNumber },
    });
  } catch (err) {
    console.log(err);
    if (err instanceof ScrapeError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: err.message,
          },
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Erro ao fazer a consulta',
        },
      },
      { status: 400 }
    );
  } finally {
    await browser.close();
  }
}
