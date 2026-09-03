// "use client";
// import CustomInput from "@/lib/components/InputContainer/Input";
// import CustomSelect, {
//   SelectionDataProps,
// } from "@/lib/components/SelectOptions/SelectOptions";
// import { useToast } from "@/lib/components/Toast/ToastContext";
// import {
//   businessTypes,
//   DesignationOptions,
//   IndustryTypes,
//   Turnover_list,
// } from "@/lib/constants/RegisterForm/RegisterForm.constants";
// // import { merchantDetailsSubmission } from "@/lib/hooks/auth-verification";
// import { MerchantDetailsProps } from "@/lib/interfaces/register-interface";
// import { getAuthenticatedUserDetailsFromLS } from "@/lib/utils/auth-utils";
// import { NAME_REGEX } from "@/shared/regular-expressions";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const MerchantDetails = ({onNext} : {onNext: () => void}) => {
//   const [selectedEntitty, setSelectedEntity] = useState<string | null>(null);
//   // const [businessType, setBusinessType] = useState<string | null>(null);
//   const [turnOver, setTurnOver] = useState<string | null>(null);
//   const [businessName, setBusinessName] = useState<string>("");
//   const [designationType, setDesignationType] = useState<string>("");
//   const router = useRouter();
//   const { showToast } = useToast();

//   const handleSlectedEntity = (value: string | null) => {
//     setSelectedEntity(value);
//   };

//   // const handleSelectBusinessTypes = (value: string) => {
//   //   setBusinessType(value);
//   // };

//   const handleTurnOver = (value: string | null) => {
//     setTurnOver(value);
//   };

//   // const { mutate } = merchantDetailsSubmission();

//   const handleSubmitMerchantDetails = () => {
//     const authenticatedUser = getAuthenticatedUserDetailsFromLS();

//     const data: MerchantDetailsProps = {
//       email: authenticatedUser?.email ?? null,
//       businessEntityType: Number(selectedEntitty),
//       // industry: Number(businessType),
//       turnover: Number(turnOver),
//       businessName: businessName,
//       designation: designationType,
//     };
//     onNext();
//   };
//   const validate = (value: string) => value.match(NAME_REGEX);
//   const validateNameSate = React.useMemo(() => {
//     if (businessName === "") return undefined;

//     return validate(businessName) ? "valid" : "invalid";
//   }, [businessName]);

//   return (
//     // min-h-screen
//     <div className="flex flex-col items-center text-center justify-center">
//       <div className="flex flex-col px-8 py-6">
//         <h1 className="text-[80px] font-extrabold sm:text-3xl sm:font-semibold mb-4">
//           Your business details
//         </h1>
//         <p className="mb-2 text-base leading-6 sm:text-md">
//           Enhance your experience on RupeeFlow to choose your business needs.
//         </p>

//         <div className=" flex flex-col mb-4 ">
//         <CustomInput
//             type="text"
//             name="businessName"
//             placeholder="Enter your business name"
//             label="Business Name"
//             className="w-full mb-4"
//             value={businessName}
//             onValueChange={setBusinessName}
//             isRequired={true}
//             errorMessage={
//               validateNameSate === "invalid" &&
//               "Please enter a valid businessname"
//             }
//             validationState={validateNameSate}
//             onClear={() => console.log("input cleared")}
//             isInvalid={validateNameSate === "invalid"}
//           />
//           <CustomSelect
//             label="Entity type"
//             value={selectedEntitty}
//             onChange={value => handleSlectedEntity(value)}
//             selectionData={businessTypes as SelectionDataProps[]}
//             classNames={{
//               label: "text-secondary",
//               mainWrapper:
//                 "bg-white dark:bg-white shadow-large rounded-xl w-[480px] mb-4 ",
//               innerWrapper:
//                 "bg-white dark:bg-white hover:border-none hover:bg-white/100 dark:hover:bg-white/100 focus-within:!bg-white/50 dark:focus-within:!bg-default/60 !cursor-pointer border-none data-[hover=true]:border-none data-[open=true]:border-none data-[focus=true]:border-none",
//               listboxWrapper: "border-none",
//               trigger: "border-none",
//             }}
//             variant="bordered"
//           />
//           <CustomSelect
//             label="Annual Business Turnover"
//             value={turnOver}
//             onChange={(value: string | null) => handleTurnOver(value)}
//             selectionData={Turnover_list as SelectionDataProps[]}
//             classNames={{
//               label: "text-secondary",
//               mainWrapper:
//                 "bg-white dark:bg-white shadow-large rounded-xl w-[480px] mb-4 ",
//               innerWrapper:
//                 "bg-white dark:bg-white hover:border-none hover:bg-white dark:hover:bg-white/70 focus-within:!bg-white/50 dark:focus-within:!bg-default/60 !cursor-pointer border-none data-[hover=true]:border-none data-[open=true]:border-none data-[focus=true]:border-none",
//               listboxWrapper: "border-none",
//               trigger: "border-none",
//             }}
//             variant="bordered"
//           />
//           <CustomSelect
//             label="Designation"
//             placeholder="Select your designation"
//             value={designationType}
//             onChange={setDesignationType}
//             selectionData={DesignationOptions}
//             classNames={{
//               label: "text-secondary",
//               // default-200/60
//               mainWrapper:
//                 "bg-white dark:bg-white shadow-large rounded-xl w-[480px] mb-4 ",
//               innerWrapper:
//                 "bg-white dark:bg-white hover:border-none hover:bg-white dark:hover:bg-white/70 focus-within:!bg-white/50 dark:focus-within:!bg-default/60 !cursor-pointer border-none data-[hover=true]:border-none data-[open=true]:border-none data-[focus=true]:border-none",
//               listboxWrapper: "border-none",
//               trigger: "border-none",
//             }}
//             variant="bordered"
//             name="designation"
//           />
//         </div>
//         <div className="flex gap-4 mt-4">
//           <button
//             className="bg-primary-600 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full"
//             onClick={handleSubmitMerchantDetails}>
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MerchantDetails;

export default function Page() {
  return null;
}
