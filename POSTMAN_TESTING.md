# Postman Testing Guide: Job to Blockchain Flow

Ikuti urutan request di bawah ini untuk mengetes flow lengkap dari posting pekerjaan hingga registrasi blockchain.

## 1. Authentication

### Register Employer
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Body (raw JSON):**
```json
{
  "name": "Budi Employer",
  "email": "budi@example.com",
  "password": "password123",
  "role": "employer"
}
```

### Register Worker
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Body (raw JSON):**
```json
{
  "name": "Ani Worker",
  "email": "ani@example.com",
  "password": "password123",
  "role": "worker"
}
```

> [!TIP]
> Copy `token` dari response login/register dan masukkan ke **Auth > Bearer Token** di Postman untuk request selanjutnya.

---

## 2. Job Lifecycle (Employer)

### Create Job
- **Method:** `POST`
- **URL:** `{{base_url}}/api/jobs`
- **Body (raw JSON):**
```json
{
  "title": "Smart Contract Developer",
  "description": "Develop and audit smart contracts on Base Network.",
  "wage": 2500,
  "location": "Remote",
  "requirements": ["Solidity", "Hardhat", "Foundry"]
}
```

---

## 3. Application (Worker)

### Apply for Job
- **Method:** `POST`
- **URL:** `{{base_url}}/api/jobs/{{job_id}}/apply`
- **Body (raw JSON):**
```json
{
  "coverLetter": "I have experience in Solidity and have won several hackathons."
}
```

---

## 4. Contract Creation (Employer)

### Accept Application & Create Contract
- **Method:** `POST`
- **URL:** `{{base_url}}/api/applications/{{application_id}}/accept`
- **Body (raw JSON - Optional):**
```json
{
  "startedAt": "2026-02-01T09:00:00Z",
  "finishedAt": "2026-03-01T17:00:00Z",
  "agreedWage": 2600
}
```
- **Note:** Jika body dikosongkan, sistem akan menggunakan nilai default dari Job Posting.

---

## 5. Blockchain Registration (Worker)

### Approve Contract (NEW)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/contracts/{{contract_id}}/approve`
- **Body:** `None`
- **Response Expected:**
```json
{
    "success": true,
    "message": "Contract approved and registered on blockchain",
    "data": {
        "success": true,
        "chainTxHash": "0x..."
    }
}
```

---

## 6. Verification

### Check Chain Transaction
- **Method:** `GET`
- **URL:** `{{base_url}}/api/chain-tx/{{chain_tx_id}}`
