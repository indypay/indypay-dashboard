export interface HSNCode {
  code: string;
  description: string;
}

// SAC (Service Accounting Code) for Finance and Related Services
export const FINANCE_HSN_CODES: HSNCode[] = [
  // Banking and Financial Services
  { code: '997111', description: 'Fee based financial services' },
  {
    code: '997112',
    description: 'Financial leasing services including hire purchase',
  },
  { code: '997113', description: 'Services provided by investment banking' },
  { code: '997114', description: 'Merchant banking services' },
  { code: '997115', description: 'Securities brokering services' },
  { code: '997116', description: 'Financial consultancy services' },
  { code: '997117', description: 'Foreign exchange broking services' },
  { code: '997118', description: 'Money broking services' },
  { code: '997119', description: 'Asset management services' },

  // Insurance Services
  { code: '997211', description: 'Life insurance services' },
  { code: '997212', description: 'Pension funding services' },
  { code: '997213', description: 'Accident and health insurance services' },
  { code: '997214', description: 'Motor vehicle insurance services' },
  {
    code: '997215',
    description: 'Marine, aviation and other transport insurance services',
  },
  { code: '997216', description: 'Freight insurance services' },
  { code: '997217', description: 'Other property insurance services' },
  { code: '997218', description: 'Other non-life insurance services' },
  { code: '997219', description: 'Reinsurance services' },

  // Accounting and Auditing Services
  { code: '998211', description: 'Financial auditing services' },
  { code: '998212', description: 'Accounting and book-keeping services' },
  { code: '998213', description: 'Tax consultancy and preparation services' },
  { code: '998214', description: 'Insolvency and receivership services' },

  // Business Support Services
  { code: '998311', description: 'Business consulting services' },
  { code: '998312', description: 'Financial management consulting services' },
  { code: '998313', description: 'Marketing management consulting services' },
  {
    code: '998314',
    description: 'Human resources management consulting services',
  },
  { code: '998315', description: 'Production management consulting services' },
  { code: '998316', description: 'Business process management services' },

  // Payment and Money Transmission Services
  { code: '997131', description: 'Payment and money transmission services' },
  {
    code: '997132',
    description: 'Credit card transaction processing services',
  },
  {
    code: '997133',
    description: 'Financial transaction processing and clearing house services',
  },

  // Credit Facilities
  {
    code: '997141',
    description:
      'Credit granting services in respect of loans by monetary institutions',
  },
  {
    code: '997142',
    description: 'Credit granting services in respect of credit cards',
  },
  { code: '997143', description: 'Other credit granting services' },

  // Investment Services
  {
    code: '997151',
    description: 'Portfolio management services, except pension funds',
  },
  {
    code: '997152',
    description: 'Portfolio management services for pension funds',
  },
  { code: '997153', description: 'Trust and custody services' },

  // Invoice/Payment Services
  { code: '999411', description: 'Invoice discounting services' },
  { code: '999412', description: 'Factoring services' },

  // General Services (Commonly used for invoicing)
  {
    code: '998599',
    description: 'Other professional, technical and business services',
  },
  { code: '998591', description: 'Bill collection services' },
  { code: '998592', description: 'Credit reporting and rating services' },
];

// Helper function to search HSN codes
export const searchHSNCodes = (query: string): HSNCode[] => {
  const lowerQuery = query.toLowerCase();
  return FINANCE_HSN_CODES.filter(
    (item) =>
      item.code.includes(query) ||
      item.description.toLowerCase().includes(lowerQuery),
  );
};

// Helper function to get HSN code by code
export const getHSNCodeByCode = (code: string): HSNCode | undefined => {
  return FINANCE_HSN_CODES.find((item) => item.code === code);
};
