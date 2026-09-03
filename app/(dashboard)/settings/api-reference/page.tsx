'use client';
import React, { useState } from 'react';
import {
  Card,
  Button,
  Select,
  SelectItem,
  CardBody,
  Snippet,
} from '@heroui/react';
import { Input } from 'antd';
import { Spinner } from '@heroui/react';
import { unstable_noStore } from 'next/cache';

import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import {
  apisReferences,
  curlReferences,
} from '@/lib/constants/api-references/api-references.constant';
import CustomInput from '@/lib/components/InputContainer/Input';
import { safeAny } from '@/lib/interfaces/global.interface';

const ApiMethod = ({ method }: { method: string }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${
      method === 'POST'
        ? 'bg-green-200 text-green-800'
        : 'bg-blue-200 text-blue-800'
    }`}
  >
    {method}
  </span>
);

const ApiCard = ({
  api,
  isSelected,
  onClick,
}: {
  api: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  };
  isSelected: boolean;
  onClick: (api: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  }) => void;
}) => (
  <Card
    isPressable
    onPress={() => onClick(api)}
    className={`mb-2 ${isSelected ? 'border-2' : ''}`}
    style={isSelected ? { borderColor: 'var(--secondary)' } : {}}
  >
    <CardBody className="flex flex-row justify-between items-center p-3 space-x-8">
      <span>{api.name}</span>
      <ApiMethod method={api.method} />
    </CardBody>
  </Card>
);

const ApiList = ({
  apis,
  selectedApi,
  onApiClick,
}: {
  apis: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  }[];
  selectedApi: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  };
  onApiClick: (api: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  }) => void;
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Payment APIs</h2>
    {apis.map((api, index) => (
      <ApiCard
        key={index}
        api={api}
        isSelected={selectedApi?.name === api.name}
        onClick={onApiClick}
      />
    ))}
  </div>
);

const ApiForm = ({
  api,
  onFormChange,
}: {
  api: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  };
  onFormChange: (formValues: safeAny) => void;
}) => {
  const [formValues, setFormValues] = useState<safeAny>({});

  const handleInputChange = (name: string, value: safeAny) => {
    if (name === 'amount') {
      value = Number(value);
    }
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);
    onFormChange(updatedValues);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{api.name}</h2>
      <Card>
        <CardBody>
          {api.fields.map((field) =>
            field.type === 'select' ? (
              <Select
                key={field.name}
                label={field.label}
                placeholder={`Select ${field.label}`}
                className="mb-4"
                onChange={(value) => handleInputChange(field.name, value)}
              >
                {field.options.map((option: string) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>
            ) : (
              <div key={field.name} className="mb-4">
                <label className="block text-sm mb-1">
                  {field.label}{' '}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <Input
                  placeholder={field.label}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              </div>
            ),
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  // showToast(`${text} copied to clipboard`, "success");
};

const ApiPlayground = ({
  api,
  formValues,
}: {
  api: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  };
  formValues: safeAny;
}) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const curlCommand =
    curlReferences.find((curlRef) => curlRef.name === api.name)?.curl ||
    'No cURL command available';

  const handleTryIt = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/payin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`, // Replace with your actual clientId and clientSecret
        },
        body: JSON.stringify({ clientId, clientSecret, ...formValues }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setError(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">API Playground</h2>
      <Card className="bg-white dark:bg-black">
        <CardBody>
          <h3 className="text-lg font-semibold mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'C# - HttpClient',
              'C# - RestSharp',
              'cURL',
              'Dart - dio',
              'Dart - http',
              'Go - Native',
            ].map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant="flat"
                style={{
                  background:
                    lang !== 'cURL'
                      ? 'var(--border)'
                      : 'linear-gradient(to right, var(--border), var(--primary))',
                  color: lang !== 'cURL' ? 'var(--text-muted)' : 'var(--background)',
                  fontWeight: 600,
                  cursor: lang !== 'cURL' ? 'not-allowed' : 'pointer',
                }}
                disabled={lang !== 'cURL'}
              >
                {lang}
              </Button>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-2">Authorization</h3>
          <CustomInput
            label="username"
            placeholder="client-id"
            className="mb-4"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <CustomInput
            label="password"
            placeholder="client-secret"
            className="mb-4"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto dark:text-black">
            {curlCommand}
          </pre>
          <div className="flex justify-end mt-4 space-x-4 mr-4">
            <CustomButton
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                color: 'var(--background)',
                fontWeight: 600,
              }}
              // variant="flat"
              onClick={handleTryIt}
            >
              {isLoading ? <Spinner /> : 'Try it!'}
            </CustomButton>
            <Snippet
              onCopy={() => handleCopy(curlCommand)}
              // children=""
              style={{
                background: 'linear-gradient(to right, var(--border), var(--primary))',
                color: 'var(--background)',
              }}
              symbol=""
            />
          </div>
          {response && (
            <Card className="mt-4">
              <CardBody className="dark:text-black">
                <h3 className="text-lg font-semibold mb-2">Response</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  {response}
                </pre>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const ApiReferences = () => {
  unstable_noStore();

  const [selectedApi, setSelectedApi] = useState<{
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  }>(apisReferences[0]);
  const [formValues, setFormValues] = useState<safeAny>({});

  const handleApiClick = (api: {
    name: string;
    method: string;
    backgroundColor: string;
    fields: safeAny[];
  }) => {
    setSelectedApi(api);
    setFormValues({});
  };

  const handleFormChange = (values: safeAny) => {
    setFormValues(values);
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <ApiList
        apis={apisReferences}
        selectedApi={selectedApi}
        onApiClick={handleApiClick}
      />
      {selectedApi && (
        <ApiForm
          api={
            selectedApi as {
              name: string;
              method: string;
              backgroundColor: string;
              fields: safeAny[];
            }
          }
          onFormChange={handleFormChange}
        />
      )}
      {selectedApi && (
        <ApiPlayground
          api={
            selectedApi as {
              name: string;
              method: string;
              backgroundColor: string;
              fields: safeAny[];
            }
          }
          formValues={formValues}
        />
      )}
    </div>
  );
};

export default ApiReferences;
