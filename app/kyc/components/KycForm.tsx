'use client';

import { useKycStore } from '../store/useKycStore';

import PersonalInformation from './PersonalInformation';
import BusinessStructure from './BusinessStructure';
import KYBInformation from './KybInformation';
import BankVerification from './BankVerification';
import UploadDocuments from './UploadDocuments';

export default function KycForm() {
  const { currentStep } = useKycStore();

  switch (currentStep) {
    case 1:
      return <PersonalInformation />;
    case 2:
      return <BusinessStructure />;
    case 3:
      return <KYBInformation />;
    case 4:
      return <BankVerification />;
    case 5:
      return <UploadDocuments />;
    default:
      return null;
  }
}
