// // import { ToastType } from '@lib/enums/toast.enum';
// // import { setToast } from '@stores/toast.store';
// "use client";
// import { ToastType } from "../enum/toast";
// // import { ToastStore } from "@/store/toast-store";

// export const showSuccessToast = (message: string) => {
//   showToast(message, "success");
// };
// export const showErrorToast = (message: string) => {
//   showToast(message, "error");
// };
// export const showHintToast = (message: string) => {
//   showToast(message, "hint");
// };
// export const showWarnToast = (message: string) => {
//   showToast(message, "warn");
// };

// const showToast = (message: string, type: ToastType) => {
//   setData({
//     message,
//     type,
//   });
// };

// const validate = (
//   values: { [key: string]: string },
//   regexPatterns: { [key: string]: RegExp },
// ) => {
//   return Object.keys(values).reduce(
//     (acc, key) => {
//       const value = values[key];
//       const regex = regexPatterns[key];
//       if (regex) {
//         acc[key] = regex.test(value) ? 'valid' : 'invalid';
//       }
//       return acc;
//     },
//     {} as { [key: string]: string },
//   );
// };

// const validateAllFields = React.useMemo(() => {
//     const valuesToValidate = {
//         email,
//         mobile,
//         bankName,
//         accountNumber,
//         ifscCode,
//     };

//     const regexPatterns = {
//         email: EMAIL_REGEX,
//         mobile: PHONE_REGEX,
//         bankName: NAME_REGEX, // Assuming NAME_REGEX is appropriate for bank names
//         accountNumber: ACCOUNT_NUMBER_REGEX, // Use the appropriate regex for account numbers
//         ifscCode: IFSC_REGEX, // Use the appropriate regex for IFSC codes
//     };

//     return validate(valuesToValidate, regexPatterns);
// }, [email, mobile, bankName, accountNumber, ifscCode]);
