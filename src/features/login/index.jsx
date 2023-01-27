import React, { useEffect } from 'react';
import { useAuth } from 'reactfire';
import { signInWithCustomToken } from 'firebase/auth';

import imgLogin from '@/assets/images/login.jpeg';
import imgLogoISS from '@/assets/images/iss.svg';

import useTenant from '@/hooks/useTenant.js';
import useTranslations from '@/hooks/useTranslations.js';
import useTokenParam from '@/hooks/useTokenParam.js';
import FullScreenLoader from '@/components/FullScreenLoader';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const loginUrl = `https://youchoose.eu.auth0.com/authorize?response_type=code&response_mode=form_post&client_id=SkMyjsfZf2SVsHv2lTIwm5QfN1R6Bg0W&redirect_uri=${apiBaseUrl}/api/authCallback&scope=email&audience=https://youchoose.eu.auth0.com/api/v2/`;

function Login() {
  const [tenant] = useTenant();
  const [translations] = useTranslations();
  const tokenParam = useTokenParam();

  const auth = useAuth();

  useEffect(() => {
    if (!tokenParam) {
      return;
    }

    const authenticateWithFirebase = async (token) => {
      try {
        await signInWithCustomToken(auth, token);
        window.history.pushState({}, '', `${location.pathname}`);
      } catch (error) {
        console.log('error', error);
      }
    };
    authenticateWithFirebase(tokenParam);
  }, [auth, tokenParam]);

  if (!tenant?.id) {
    return (
      <FullScreenLoader
        backgroundColor={tenant?.branding?.headerBackgroundColor}
      />
    );
  }

  const tenantLoginUrl = `${loginUrl}&state=${tenant?.subdomain}`;

  return (
    <div className="flex min-h-screen">
      <div
        className="flex flex-1 flex-col justify-between py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
        style={{
          backgroundColor: tenant?.branding?.headerBackgroundColor,
        }}
      >
        <div className="flex flex-col justify-center mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <img
              className="h-12 lg:h-20"
              alt={tenant?.branding?.productName}
              src={tenant?.branding?.logoUrl}
            />
          </div>
          <h1 className="mt-7 text-2xl font-bold text-center">
            {tenant?.branding?.productName}
          </h1>
        </div>
        <div className="flex flex-1 flex-col justify-center mx-auto w-full max-w-sm lg:w-96">
          <div className="mt-6">
            <a
              href={tenantLoginUrl}
              className="flex w-full justify-center rounded-sm border border-transparent bg-indigo-600 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              style={{
                backgroundColor: tenant?.branding?.primaryColor,
              }}
            >
              {translations?.['log-in']}
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center mx-auto w-full max-w-sm lg:w-96">
          <span className="mr-6 small font-light">
            {translations?.['powered-by']}
          </span>
          <img
            className="h-10"
            alt={`${translations?.['powered-by']} by ISS`}
            src={imgLogoISS}
          />
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={imgLogin}
          alt=""
        />
      </div>
    </div>
  );
}

export default Login;
