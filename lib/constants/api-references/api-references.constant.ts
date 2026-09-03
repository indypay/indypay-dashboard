import { safeAny } from '@/lib/interfaces/global.interface';

export const apisReferences: {
  name: string;
  method: string;
  backgroundColor: string;
  fields: safeAny[];
}[] = [
  {
    name: 'Initiate PayIn',
    method: 'POST',
    backgroundColor: 'bg-green-200',
    fields: [
      { name: 'orderId', label: 'Order Id', required: true },
      {
        name: 'pgReturnSuccessUrl',
        label: 'pgReturnSuccessUrl',
        required: true,
      },
      {
        name: 'pgReturnFailureUrl',
        label: 'pgReturnFailureUrl',
        required: true,
      },
      { name: 'amount', label: 'Amount', required: true },
      { name: 'firstName', label: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', required: true },
      { name: 'email', label: 'Email', required: true },
      { name: 'phone', label: 'Phone', required: true },
    ],
  },
  {
    name: 'Check status of PayIn',
    method: 'POST',
    backgroundColor: 'bg-blue-200',
    fields: [{ name: 'orderId', label: 'Order Id', required: true }],
  },
  {
    name: 'Webhook/Callback Format',
    method: 'POST',
    backgroundColor: 'bg-yellow-200',
    fields: [
      { name: 'orderId', label: 'Order Id', required: true },
      { name: 'status', label: 'Status', required: true },
      { name: 'transactionId', label: 'Transaction Id', required: true },
    ],
  },
  {
    name: 'Initiate PayOut',
    method: 'POST',
    backgroundColor: 'bg-green-200',
    fields: [
      { name: 'orderId', label: 'Order Id', required: true },
      { name: 'amount', label: 'Amount', required: true },
      { name: 'account_number', label: 'Account Number', required: true },
      {
        name: 'payment_mode',
        label: 'Payment Mode',
        required: true,
        type: 'select',
        options: ['IMPS', 'NEFT', 'RTGS'],
      },
      { name: 'reference_id', label: 'Reference ID', required: true },
      { name: 'transcation_note', label: 'Transaction Note', required: false },
      { name: 'beneficiaryName', label: 'Beneficiary Name', required: true },
      { name: 'ifsc', label: 'IFSC', required: true },
      {
        name: 'industryType',
        label: 'Industry Type',
        required: true,
        type: 'select',
        options: ['Real Estate', 'Automobile', 'Travel', 'Education', 'E-COM'],
      },
    ],
  },
  {
    name: 'Check status of PayOut',
    method: 'POST',
    backgroundColor: 'bg-blue-200',
    fields: [{ name: 'orderId', label: 'Order Id', required: true }],
  },
  {
    name: 'Webhook/Callback Format PayOut',
    method: 'POST',
    backgroundColor: 'bg-yellow-200',
    fields: [
      { name: 'orderId', label: 'Order Id', required: true },
      { name: 'status', label: 'Status', required: true },
      { name: 'transferId', label: 'Transaction Id', required: true },
      { name: 'amount', label: 'Amount', required: true },
    ],
  },
];

export const curlReferences = [
  {
    name: 'Initiate PayIn',
    curl: `curl --location '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payin' \
--header 'Content-Type: application/json' \
--header 'Authorization:Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--header 'Cookie: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data-raw '{"orderId": "xxxxxxx", "amount": 0, "firstName": "xxxxxxx", "lastName": "xxxxxxx", "email": "xxxxxxx", "phone": "xxxxxxx" }'`,
  },
  {
    name: 'Check status of PayIn',
    curl: `curl --location '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payin/status' \
--header 'Content-Type: application/json' \
--header 'Authorization:Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--header 'Cookie: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data '{
  "orderId": "order_Rahul_231"
}'`,
  },
  {
    name: 'Webhook/Callback Format',
    curl: `curl --location '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payments/payin/callback' \
--header 'Content-Type: application/json' \
--header 'Authorization:Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--header 'Cookie: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data-raw '{"orderId": "xxxxxxx", "status": "xxxxxxx", "transactionId": "xxxxxxx" }'`,
  },
  {
    name: 'Initiate PayOut',
    curl: `curl --location '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payments/payout/create' \
--header 'Content-Type: application/json' \
--header 'Authorization:Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--header 'Cookie: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data-raw '{"orderId": "xxxxxxx", "amount": 0, "account_number": "xxxxxxx", "payment_mode": "xxxxxxx", "reference_id": "xxxxxxx", "transcation_note": "xxxxxxx", "beneficiaryName": "xxxxxxx", "ifsc": "xxxxxxx", "industryType": "xxxxxxx" }'`,
  },
  {
    name: 'Check status of PayOut',
    curl: `curl --location '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payments/payout/status' \
--header 'Content-Type: application/json' \
--header 'Authorization:Basic xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--header 'Cookie: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data-raw '{"orderId": "xxxxxxx" }'`,
  },
  {
    name: 'Webhook/Callback Format PayOut',
    curl: `curl --location '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payments/payout/callback' \
--header 'Content-Type: application/json' \
--header 'Authorization: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--header 'Cookie: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' \
--data-raw '{"orderId": "xxxxxxx", "status": "xxxxxxx", "transferId": "xxxxxxx", "amount": "xxxxxxx" }'`,
  },
];
