// "use client";
// import MultiFactorIcon from "@/public/assests/Icon/MultiFactorIcon";
// import Image from "next/image";
// import React, { useState } from "react";
// import { Modal, ModalContent } from "@heroui/react";
// import CustomInput from "../../../lib/components/InputContainer/Input";
// import { CustomButton } from "@/lib/components/ButtonComponent/CustomButton";
// import { getAuthenticatedUserDetailsFromLS } from "@/lib/utils/auth-utils";
// import {
//   generateQRCodeLink,
//   signInwithGoogle,
// } from "@/lib/hooks/auth-verification";
// import { LoginRequest } from "@/lib/interfaces/authentication.interface";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/lib/components/Toast/ToastContext";
// const MultFactorAuth = () => {
//   const [code, setCode] = useState<string>("");
//   const router = useRouter();
//   const verifiedUser = getAuthenticatedUserDetailsFromLS();
//   const email = verifiedUser?.email;

//   const { mutate } = signInwithGoogle();
//   const { showToast } = useToast();

//   const { data: response, error } = generateQRCodeLink(email);

//   const loginVerify = () => {
//     if (!code) {
//       showToast("Code not found!", "error");
//       return;
//     }

//     const loginData: LoginRequest = {
//       email: email,
//       code2FA: code,
//     };

//     mutate(loginData, {
//       onSuccess: (data) => {
//         const [response, error] = data;

//         if (error) {
//           showToast(error?.message, "error");
//           return;
//         }
//         if (response) {
//           showToast(response?.message, "success");
//           router.push("/home");
//           return;
//         }
//       },
//     });
//   };

//   return (
//     <>
//       <Modal
//         size="md"
//         isOpen={true}
//         isDismissable={false}
//         isKeyboardDismissDisabled={true}
//         hideCloseButton={true}
//         className="mb-2"
//       >
//         <ModalContent>
//           <div className="flex flex-col items-center justify-center mx-20 my-20">
//             <MultiFactorIcon
//               height={50}
//               width={50}
//               className="mb-4 dark:bg-white"
//               color="#fff"
//             />
//             {response && response[0] && response[0].qrCode && (
//               <Image
//                 src={response[0].qrCode}
//                 height={100}
//                 width={250}
//                 alt="QR Code"
//                 className="mb-6 mt-4"
//               />
//             )}
//             <div className="flex flex-col items-center justify-center mb-2 mt-4">
//               <p className="font-semibold mb-2">Authentication code</p>
//               <CustomInput
//                 type="text"
//                 placeholder="XXXXXX"
//                 name="input-field"
//                 className="mb-6"
//                 variant="flat"
//                 value={code}
//                 onValueChange={setCode}
//               />
//               <CustomButton
//                 color="primary"
//                 className="mb-6 w-full"
//                 onClick={loginVerify}
//               >
//                 Verify
//               </CustomButton>
//               <p className="font-medium text-center">
//                 Open your two-factor authenticator (TOTP) app or browser
//                 extension to view your authentication code.
//               </p>
//             </div>
//           </div>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default MultFactorAuth;
import React from 'react';

const page = () => {
  return <div>page</div>;
};

export default page;
