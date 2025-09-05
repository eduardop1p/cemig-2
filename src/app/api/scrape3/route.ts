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
import validationCNPJ from '@/services/validationCNPJ';
import validationCPF from '@/services/validationCPF';

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

    await page.goto('https://atende.cemig.com.br/Login', {
      waitUntil: 'domcontentloaded',
    });

    const token = await capsolver();
    if (!token) throw new ScrapeError('Ocorreu um erro, tente novamente', 401);
    const passwordBase64 = Buffer.from(password, 'utf-8').toString('base64');

    const changeCPF = (value: string) => {
      value = value.replace(/[^\d]/g, '');
      value = value.slice(0, 11);
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      return value;
    };

    const changeCNPJ = (value: string) => {
      value = value.replace(/[^\d]/g, '');
      value = value.slice(0, 14);
      // Aplica a formatação de CNPJ usando regex em etapas
      value = value.replace(/^(\d{2})(\d)/, '$1.$2'); // Formata os dois primeiros dígitos
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Formata os próximos três dígitos
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Formata os próximos três dígitos e adiciona a barra
      value = value.replace(/(\d{4})(\d)/, '$1-$2'); // Formata os quatro dígitos e adiciona o hífen

      return value;
    };
    if (validationCPF(user)) user = changeCPF(user);
    if (validationCNPJ(user)) user = changeCNPJ(user);

    const isAuth = await page.evaluate(
      async (user, passwordBase64, realUserAgent, token) => {
        const url = 'https://atende.cemig.com.br/Login';
        const __RequestVerificationToken =
          document.querySelector<HTMLInputElement>(
            'input[name=__RequestVerificationToken]'
          )?.value ?? '';

        const newBody = new URLSearchParams({
          __RequestVerificationToken: __RequestVerificationToken,
          AcessoCompartilhado: 'False',
          RedirectExcluirConta: 'False',
          ServiceId: '',
          Acesso: user,
          Senha: passwordBase64,
          'g-recaptcha-response': token,
        });

        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              accept: '*/*',
              'content-type':
                'application/x-www-form-urlencoded; charset=UTF-8',
              'user-agent': realUserAgent,
              'x-requested-with': 'XMLHttpRequest',
            },
            credentials: 'include',
            body: newBody,
          });
          if (!res.ok) throw new Error('Usuário ou senha inválidos');
          return true;
        } catch {
          return false;
        }
      },
      user,
      passwordBase64,
      realUserAgent,
      token
    );
    if (!isAuth)
      throw new ScrapeError(
        'Ocorreu um erro, revise USUÁRIO e SENHA para tentar novamente.',
        401
      );
    await page.evaluate(() => {
      location.href = '/Home';
    });
    async function watchCookie(cookieName: string) {
      const start = Date.now();
      const maxTime = 20000;
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
    // const cookies = await browser.cookies();
    // let sessaoNovaAGVCookie = cookies.find(
    //   item => item.name === 'SessaoNovaAGV'
    // )?.value;
    // if (!sessaoNovaAGVCookie)
    //   throw new Error(
    //     'Ocorreu um erro, revise CPF e SENHA para tentar novamente.'
    //   );
    // const sessaoNovaAGVObj = JSON.parse(sessaoNovaAGVCookie);
    // const accessToken = sessaoNovaAGVObj.NovaAGVDadosToken.accessToken;

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
    data.installations = data.installations
      .filter(install => install.status.toLowerCase() === 'active')
      .sort((a, b) => b.debts.length - a.debts.length);

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
