## Contents

1. Initiate Payout Transaction
2. Check Payout Transaction Status
3. Payout Webhook Response

### API BASE URL

- Production: [<PROD_API_BASE_URL>]()

## 1. Initiate Payout Transaction

Using this API we can create the payment gateway URL. Once we get a successful response in the API, the customer can get payment request on there UPI App.

**API URL:** `{{base_url}}/api/v1/payments/payout/create`  
**Method:** POST

### Headers

1. `Content-Type: application/json`
2. `Authorization: Basic Auth`
   - Username: `<Client ID>`
   - Password: `<Client Secret>`
   - Secret Key: Generate Secret Key from Developer Section
   - Client ID: Generate Client ID from Developer Section

### Request Body

```json
{
  "data": [
    {
      "amount": 100,
      "purpose": "Refund",
      "beneficiaryName": "Sahista",
      "bankName": "HDFC",
      "accountNumber": "1234567890",
      "ifscCode": "HDFC0000123",
      "remarks": "Refund for order 12345",
      "paymentMode": "IMPS",
      "payoutId": "payout_123" // unique identifier
    }
  ]
}
```

### Response Body

```json
{
  "statusCode": 201,
  "message": "Data Received",
  "success": true,
  "data": {
    "message": "Payout process initiated",
    "batchId": "pbatch_01JJ3TQXXXXXXXXXX5HKAHK5",
    "payoutOrders": [
      {
        "orderId": "mpout_01JJ3TQW8PMXXXXXXXXXJTTV08",
        "name": "Vivek",
        "amount": 100,
        "status": "PENDING",
        "accountNumber": "001234567890",
        "bankName": "SBI",
        "ifscCode": "SBIN0001234",
        "payoutId": "payout_123" // your unique identifier (if provided)
      }
    ],
    "summary": {
      "total": 1,
      "status": "PROCESSING"
    }
  }
}
```

### cURL

```bash
  curl --location '{{base_url}}/api/v1/payments/payout/create' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Basic a2V5XzAxa2V5XzAxSkXXXXXXXXXXXX2V5XzAxSk' \
  --data-raw '{
    "data": [
      {
        "amount": 100,
        "purpose": "Refund",
        "beneficiaryName": "Sahista",
        "bankName": "HDFC",
        "accountNumber": "1234567890",
        "ifscCode": "HDFC0000123",
        "remarks": "Refund for order 12345",
        "paymentMode": "IMPS",
        "payoutId": "payout_123"
      }
    ]
  }'
```

#### NOTE:

- Purpose: The purpose of the transaction.
- Beneficiary Name: The name of the beneficiary.
- Bank Name: The name of the bank.
- Account Number: The account number of the beneficiary.
- IFSC Code: The IFSC code of the beneficiary.
- Remarks: The remarks of the transaction.
- Payment Mode: The payment mode of the transaction (IMPS/NEFT/RTGS).
- "payoutId" is optional

---

## 2. Check Payout Transaction Status

Using this API we can get the status of the payout transaction.

**API URL:** `{{base_url}}/api/v1/payments/payout/status`  
**Method:** POST

### Request Body

```json
{
  "orderId": "mpout_01JJ3TQW8PMXXXXXXXXXJTTV08"
}
```

### Response Body

```json
{
  "statusCode": 200,
  "message": "Data Received",
  "success": true,
  "data": {
    "orderId": "mpout_01JJ3TQW8PMXXXXXXXXXJTTV08",
    "status": "SUCCESS" | "PENDING" | "FAILED",
    "txnRefId": "ABC094320545671",
    "payoutId": "payout_123"
  }
}
```

### cURL

```bash
  curl --location '{{base_url}}/api/v1/payments/payout/status' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Basic a2V5XzAxa2V5XzAxSkXXXXXXXXXXXX2V5XzAxSk' \
  --data-raw '{
    "orderId": "mpout_01JJ3TQW8PMXXXXXXXXXJTTV08"
  }'
```

---

## 3. Payout Webhook Response

When merchant have configured there webhook URL to our dashboard, we will send webhook response to there endpoint wherever payment status will change/update by Bank.

### Request Body

```json
{
  "orderId": "mpout_01JJ3TQW8PMXXXXXXXXXJTTV08",
  "status": "SUCCESS" | "PENDING" | "FAILED",
  "amount": 100,
  "txnRefId": "ABC094320545671",
  "payoutId": "payout_123"
}
```

#### NOTE:

- Status: "SUCCESS / FAILED / PENDING"

## 4. Payout Wallet

Using this API we can get the payout Wallet details.

**API URL:** `{{base_url}}/api/v1/payments/payout/wallet`  
**Method:** GET

### cURL

```bash
  curl --location '{{base_url}}/api/v1/payments/payout/wallet' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Basic a2V5XzAxa2V5XzAxSkXXXXXXXXXXXX2V5XzAxSk' \
```

### Response Body

```json
{
  "statusCode": 200,
  "message": "Data Received",
  "success": true,
  "data": {
    "id": "wlt_01JCXXXXXXXXXXXSGH7",
    "availablePayoutBalance": "1000.00",
    "totalPayout": "900.00",
    "totalTopUp": "1000.00",
    "user": {
      "id": "usr_01JXXXXXXXXXE6JK4",
      "fullName": "Vivek K"
    }
  }
}
```

---

## FAQ

1. **How to generate Client ID and Secret Key?**

   > To generate Client ID and Secret Key, login to your dashboard and go to Settings > Developer Section > Click on Generate > New Client ID and Secret Key is Generated.

2. **How to whitelist the IP address?**
   > To whitelist the IP address, go to Settings > Developer Section > (Scroll down) Enter IP Address > Click Add.
