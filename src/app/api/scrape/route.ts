export const maxDuration = 300;

import { headers as nextHeaders } from 'next/headers';
import { userAgent as userAgentNext } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';

import decryptData from '@/actions/decryptData';
import puppeteerConfig from '@/config/puppeteerConfig';
import createUser from '@/db/actions/user/createUser';
import ScrapeError from '@/errors/scrapeError';
import capsolver from '@/functions/capsolver';
import getText from '@/functions/getText';
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
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Parâmetros de requisição inválidos',
            description: '',
          },
        },
        { status: 400 }
      );
    }
    console.warn(body);

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

    await page.waitForSelector('.modal-backdrop.fade.in', { hidden: true });
    try {
      await page.waitForSelector('#spnAlertasGerais', { timeout: 2000 });
      const textElement = await getText(page, '#spnAlertasGerais');
      if (textElement) throw new ScrapeError(textElement, 401);
    } catch (err) {
      if (err instanceof ScrapeError) {
        throw new ScrapeError(err.message, 401);
      }
    }

    async function watchCookie(cookieName: string) {
      const start = Date.now();
      const maxTime = 30000;
      const interval = 1000;

      while (true) {
        const puppeteerCookies = await browser.cookies();
        const cookie = puppeteerCookies.find(c => c.name === cookieName);
        if (cookie) {
          return cookie.value; // encerra a função se encontrou
        }
        // se passou do tempo máximo, encerra retornando null
        if (Date.now() - start > maxTime) {
          return null;
        }
        // espera antes de checar de novo
        await new Promise(res => setTimeout(res, interval));
      }
    }
    const accessToken = await watchCookie('__Secure-next-auth.access-token');
    const sessionToken = await watchCookie('__Secure-next-auth.session-token');

    if (!accessToken || !sessionToken)
      throw new ScrapeError(
        'Ocorreu um erro, Revise Usuário ou Senha e tente novamente',
        401
      );
    const resAuth = await fetch(
      'https://www.atendimento.cemig.com.br/portal/api/auth/session',
      {
        method: 'get',
        headers: {
          'User-Agent': realUserAgent,
          'Content-Type': 'application/json',
          cookie: `__Secure-next-auth.access-token=${accessToken};__Secure-next-auth.session-token=${sessionToken}`,
        },
      }
    );
    let dataAuth = await resAuth.json();
    dataAuth = dataAuth.data;

    const resInstallations = await fetch(
      'https://www.atendimento.cemig.com.br/graphql',
      {
        method: 'post',
        headers: {
          'User-Agent': realUserAgent,
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
          cookie: `__Secure-next-auth.access-token=${accessToken};__Secure-next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify({
          operationName: 'SiteListByBusinessPartnerV2',
          query:
            'query SiteListByBusinessPartnerV2($input: SiteListByBusinessPartnerV2InputDTO!) {\n  siteListByBusinessPartnerV2(input: $input) {\n    sites {\n      id\n      owner\n      clientNumber\n      siteNumber\n      address\n      status\n      contract\n      contractAccount\n      classSubClassDescription\n      siteType\n      suspenseDate\n      contractFP\n      contractP\n    }\n    activeSites\n    inactiveSites\n    pagesCount\n    sitesCount\n  }\n}\n',
          variables: {
            input: {
              pId: dataAuth.protocol.pId,
              pIdRelation: '',
              pageNumber: 1,
              pageSize: 10,
            },
          },
        }),
      }
    );
    let dataInstallations = await resInstallations.json();
    dataInstallations =
      dataInstallations.data.siteListByBusinessPartnerV2.sites;

    dataInstallations = dataInstallations.map(async (item: any) => {
      const resDebts = await fetch(
        'https://www.atendimento.cemig.com.br/graphql',
        {
          method: 'post',
          headers: {
            'User-Agent': realUserAgent,
            'Content-Type': 'application/json',
            authorization: `Bearer ${accessToken}`,
            cookie: `__Secure-next-auth.access-token=${accessToken};__Secure-next-auth.session-token=${sessionToken};siteNumber=${item.siteNumber}`,
            'attendant-id': 'null',
            channel: 'agv',
            'p-id-relation': '',
            protocol: dataAuth.protocol.protocol,
            'p-id': dataAuth.protocol.pId,
            'protocol-id': dataAuth.protocol.protocolId,
            'protocol-type': dataAuth.protocol.type,
          },
          body: JSON.stringify({
            operationName: 'DebtsV2',
            query:
              'query DebtsV2($input: DebtsInputDTO!) {\n  debtsV2(input: $input) {\n    bills {\n      billIdentifier\n      status\n      value\n      referenceMonth\n      site {\n        id\n        siteNumber\n        clientNumber\n        contract\n        contractAccount\n      }\n      dueDate\n      documentContractAccount\n      debtLockCode\n      debtLockDescription\n    }\n  }\n}\n',
            variables: {
              input: { siteId: item.id },
            },
          }),
        }
      );
      let dataDebts = await resDebts.json();
      dataDebts = dataDebts.data.debtsV2.bills;
      return { ...item, debts: dataDebts };
    });
    dataInstallations = await Promise.all(dataInstallations);
    dataAuth = dataAuth.user;

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
        debts: itemInstallations.debts.map((itemDebts: any) => ({
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
