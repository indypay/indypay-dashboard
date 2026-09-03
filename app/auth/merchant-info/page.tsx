'use client';
import React, { useState } from 'react';

import { AuthenticatedUser } from '@/lib/interfaces/authentication.interface';
// import VerifyingPopus from '@/lib/components/VerifyingPopups/VerifyingPopus';
import CustomInput from '@/lib/components/InputContainer/Input';
import { CustomButton } from '@/lib/components/ButtonComponent/CustomButton';
import { NAME_REGEX, PHONE_REGEX } from '@/shared/regular-expressions';
// import ErrorHandlerMessage from '@/lib/components/ErrorHandler/ErrorHandlerMessage';
import { getAuthenticatedUserDetailsFromLS } from '@/lib/utils/auth-utils';
import { useToast } from '@/lib/components/Toast/ToastContext';
// import { submitMerchantInfoSubmission } from "@/lib/hooks/auth-verification";
const UsersBasicDetails = () => {
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  // const [verifyModal, setVerifyModal] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  // const { mutate } = submitMerchantInfoSubmission();

  const authenticatedUsers = getAuthenticatedUserDetailsFromLS();

  const handleSubmit = async () => {
    const merchantInfoData: AuthenticatedUser = {
      fullName: name,
      // businessName: businessName,
      // designation: designationType,
      mobile: mobile,
      email: authenticatedUsers?.email ?? null,
    };

    const isValid =
      merchantInfoData.fullName &&
      // merchantInfoData.businessName &&
      // merchantInfoData.designation &&
      merchantInfoData.mobile &&
      merchantInfoData.email;

    if (!isValid) {
      showToast('Some field value are not valid', 'error');
      return;
    }
    // mutate(merchantInfoData, {
    //   onSuccess: (data: any) => {
    //     const [response, error] = data;
    //     if (error) {
    //       showToast(error?.message, "error");
    //       return;
    //     }
    //     if (response) {
    //       setVerifyModal(true);
    //       showToast(response?.message, "success");
    //       onNext();
    //       return;
    //     }

    //   },
    // });

    // onNext();
  };

  const validatePhone = (value: string) => value.match(PHONE_REGEX);

  const validationState = React.useMemo(() => {
    if (mobile === '') return undefined;

    return validatePhone(mobile) ? 'valid' : 'invalid';
  }, [mobile]);
  const validate = (value: string) => value.match(NAME_REGEX);

  const validateNameSate = React.useMemo(() => {
    if (name === '') return undefined;

    return validate(name) ? 'valid' : 'invalid';
  }, [name]);

  return (
    <>
      {/* {errorMessage && <ErrorHandlerMessage errorMessage={errorMessage} />}
      <VerifyingPopus
        title="Verifying otp"
        content="Wait for minutes"
        isOpen={verifyModal}
      /> */}
      {/* min-h-screen */}
      <div className="flex flex-col items-center text-center justify-center mx-auto my-auto ">
        <div className="flex flex-col px-8 py-6">
          <h1 className="text-[80px] font-extrabold sm:text-3xl sm:font-semibold text-primary-600 mb-4">
            Enter your Personal Information
          </h1>

          <div className="flex flex-col mb-4">
            <CustomInput
              type="text"
              name="fullName"
              // placeholder="Enter your name"
              label="Name"
              className="w-full mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              errorMessage={
                validateNameSate === 'invalid'
                  ? 'Please enter a valid name'
                  : undefined
              }
              isRequired={true}
              isInvalid={validateNameSate === 'invalid'}
            />
            {/* <CustomInput
              type="text"
              name="businessName"
              placeholder="Enter your business name"
              label="Business Name"
              className="w-full mb-4"
              value={businessName}
              onValueChange={setBusinessName}
              isRequired={true}
              errorMessage={
                validateNameSate === "invalid" &&
                "Please enter a valid businessname"
              }
              validationState={validateNameSate}
              onClear={() => console.log("input cleared")}
              isInvalid={validateNameSate === "invalid"}
            /> */}
            {/* <CustomSelect
              label="Designation"
              placeholder="Select your designation"
              value={designationType}
              onChange={setDesignationType}
              selectionData={DesignationOptions}
              classNames={{
                label: "text-secondary",
                mainWrapper:
                  "bg-white dark:bg-default-200/60 shadow-large rounded-xl w-[430px] mb-4 ",
                innerWrapper:
                  "bg-white dark:bg-default-200/60 hover:border-none hover:bg-white dark:hover:bg-default/70 focus-within:!bg-white/50 dark:focus-within:!bg-default/60 !cursor-pointer border-none data-[hover=true]:border-none data-[open=true]:border-none data-[focus=true]:border-none",
                listboxWrapper: "border-none",
                trigger: "border-none",
              }}
              variant="bordered"
              name="designation"
            /> */}
            <CustomInput
              type="text"
              name="mobile"
              placeholder="Enter your mobile number"
              label="Mobile Number"
              className="w-full"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              errorMessage={
                validationState === 'invalid'
                  ? 'Please enter a valid mobile number'
                  : undefined
              }
              isRequired={true}
              isInvalid={validationState === 'invalid'}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <CustomButton
              className="bg-primary-600 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full"
              onClick={handleSubmit}
            >
              Next
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersBasicDetails;

// import React from 'react'

// const page = () => {
//   return (
//     <div>page</div>
//   )
// }

// export default page
