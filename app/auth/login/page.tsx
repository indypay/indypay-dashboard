'use client';
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

import { doSocialLogin } from '@/app/actions';

const LoginForm = () => {
  const [value, setValue] = useState('');
  const [toggleText, setToggleText] = useState(false);
  const router = useRouter();

  const navigate = () => {
    setToggleText((prevValue) => !prevValue);
    router.push('/sign-in');
  };

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (value === '') return false;
    return validateEmail(value) ? false : true;
  }, [value]);

  return (
    <>
      <div className="flex justify-between px-6 py-6">
        <Image
          src="/assests/images/favicon_3.png"
          height={50}
          width={50}
          alt="page not found"
          className="flex items-center justify-center h-[50px] w-[50px]"
        />
        <div className="flex gap-2 items-center">
          <span style={{ color: '#95A19D', fontSize: '14px' }}>
            Don't have an account?
          </span>
          <Button
            type="text"
            onClick={navigate}
            style={{
              background: 'linear-gradient(to right, #FFFFFF, #CEFFF1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '14px',
              fontWeight: 600,
              padding: '0 4px',
              height: 'auto',
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>

      <div className="self-center w-full mt-40">
        <h1
          style={{
            textAlign: 'center',
            fontSize: '48px',
            fontWeight: 800,
            marginBottom: '8px',
            color: '#B1C4C1',
            cursor: 'pointer',
          }}
          onClick={navigate}
        >
          Sign In
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            marginBottom: '40px',
            color: '#95A19D',
          }}
        >
          Simplifying Payments &amp; Amplifying Success
        </p>

        <form
          className="flex flex-col items-center justify-center"
          action={doSocialLogin}
          style={{ maxWidth: '380px', margin: '0 auto' }}
        >
          <Button
            htmlType="submit"
            name="action"
            value="google"
            size="large"
            block
            style={{
              background: 'linear-gradient(to right, #1E6347, #25BD58)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 600,
              height: '48px',
              fontSize: '16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Sign In with Google
          </Button>

          <Button
            htmlType="submit"
            name="action"
            value="microsoft"
            size="large"
            block
            style={{
              background: 'linear-gradient(to right, #1E6347, #25BD58)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 600,
              height: '48px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Sign In with Microsoft
          </Button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
