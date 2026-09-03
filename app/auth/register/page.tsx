'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { Checkbox, Button, Input } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const BasicBusinessInfo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = React.useState('');
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === '') return false;

    return validateEmail(value) ? false : true;
  }, [value]);

  const navigate = () => {
    router.push('/sign-up');
  };

  return (
    <>
      {/* Header */}
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
            Already a member?
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
            Sign In
          </Button>
        </div>
      </div>

      <div className="self-center w-full">
        <h1
          style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#B1C4C1',
          }}
        >
          Sign up
        </h1>
        <p
          style={{
            textAlign: 'center',
            fontSize: '14px',
            marginBottom: '20px',
            color: '#95A19D',
          }}
        >
          Bring your banking &amp; finance together.
        </p>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px 16px',
            height: '48px',
            border: '1px solid #4E4E4E',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '16px',
            background: '#01261D',
          }}
        >
          <img
            style={{ width: '20px', marginRight: '12px' }}
            src="https://open-frontend-bucket.s3.amazonaws.com/open-money/login/google.svg"
            alt="Google"
          />
          <span style={{ fontSize: '16px', fontWeight: 500, color: '#B1C4C1' }}>
            Sign up with google
          </span>
        </div>

        <div
          style={{
            margin: '24px 0',
            position: 'relative',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              background: '#0C0C0C',
              padding: '0 10px',
              color: '#95A19D',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            OR
          </span>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: '#4E4E4E',
              zIndex: -1,
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#95A19D',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            First Name <span style={{ color: '#D51C44' }}>*</span>
          </label>
          <Input
            size="large"
            placeholder="Enter your full name"
            name="firstName"
            style={{
              backgroundColor: '#01261D',
              borderColor: '#4E4E4E',
              color: '#B1C4C1',
              height: '48px',
            }}
            styles={{
              input: { color: '#B1C4C1' },
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#95A19D',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Email <span style={{ color: '#D51C44' }}>*</span>
          </label>
          <Input
            size="large"
            placeholder="Enter your email"
            name="email"
            type="email"
            status={isInvalid ? 'error' : undefined}
            onChange={(e) => setValue(e.target.value)}
            style={{
              backgroundColor: '#01261D',
              borderColor: isInvalid ? '#D51C44' : '#4E4E4E',
              color: '#B1C4C1',
              height: '48px',
            }}
            styles={{
              input: { color: '#B1C4C1' },
            }}
          />
          {isInvalid && (
            <div
              style={{ color: '#D51C44', fontSize: '12px', marginTop: '4px' }}
            >
              Please enter a valid email
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#95A19D',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Mobile Number <span style={{ color: '#D51C44' }}>*</span>
          </label>
          <Input
            size="large"
            placeholder="Enter your mobile number"
            name="phoneNumber"
            type="tel"
            prefix={
              <span style={{ color: '#B1C4C1', marginRight: '8px' }}>+91</span>
            }
            style={{
              backgroundColor: '#01261D',
              borderColor: '#4E4E4E',
              color: '#B1C4C1',
              height: '48px',
            }}
            styles={{
              input: { color: '#B1C4C1' },
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: '#95A19D',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Password <span style={{ color: '#D51C44' }}>*</span>
          </label>
          <Input.Password
            size="large"
            placeholder="Enter password"
            name="password"
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined style={{ color: '#B1C4C1' }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: '#B1C4C1' }} />
              )
            }
            style={{
              backgroundColor: '#01261D',
              borderColor: '#4E4E4E',
              color: '#B1C4C1',
              height: '48px',
            }}
            styles={{
              input: { color: '#B1C4C1' },
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Checkbox
            style={{
              marginBottom: '12px',
            }}
          >
            <span style={{ color: '#B1C4C1', fontSize: '14px' }}>
              Send me the WhatsApp alerts about RupeeFlow
            </span>
          </Checkbox>
          <Checkbox>
            <span style={{ color: '#B1C4C1', fontSize: '14px' }}>
              I agree to RupeeFlow{' '}
              <span
                style={{
                  background: 'linear-gradient(to right, #FFFFFF, #CEFFF1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 600,
                }}
              >
                Terms and services
              </span>{' '}
              &{' '}
              <span
                style={{
                  background: 'linear-gradient(to right, #FFFFFF, #CEFFF1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 600,
                }}
              >
                Privacy policy
              </span>
            </span>
          </Checkbox>
        </div>

        <Button
          type="primary"
          size="large"
          htmlType="submit"
          block
          style={{
            background: 'linear-gradient(to right, #1E6347, #25BD58)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 600,
            height: '48px',
            fontSize: '16px',
          }}
        >
          Sign up
        </Button>
      </div>

      <style jsx global>{`
        .ant-input:hover,
        .ant-input-affix-wrapper:hover {
          background-color: #01261d !important;
          border-color: #30f3bc !important;
        }

        .ant-input:focus,
        .ant-input-affix-wrapper:focus,
        .ant-input-focused,
        .ant-input-affix-wrapper-focused {
          background-color: #01261d !important;
          border-color: #30f3bc !important;
          box-shadow: none !important;
        }

        .ant-input-status-error:not(.ant-input-disabled):hover {
          border-color: #d51c44 !important;
        }

        .ant-checkbox-wrapper {
          color: #b1c4c1;
        }

        .ant-checkbox-inner {
          background-color: #01261d !important;
          border-color: #4e4e4e !important;
        }

        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #25bd58 !important;
          border-color: #25bd58 !important;
        }

        .ant-checkbox-wrapper:hover .ant-checkbox-inner {
          border-color: #30f3bc !important;
        }
      `}</style>
    </>
  );
};

export default BasicBusinessInfo;
