# API Documentation - BaseIndonesiaHackatton Backend

## Table of Contents
- [Authentication](#authentication)
- [Jobs](#jobs)
- [Applications](#applications)
- [Contracts](#contracts)
- [Payments & Wallet](#payments--wallet)
- [Notifications](#notifications)
- [Ratings](#ratings)
- [Chain Transactions](#chain-transactions)

---

## Authentication
Base URL: `/api/auth`

### 1. Register
**POST** `/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "strongpassword123",
  "role": "worker" // "worker", "employer"
}
```
- **Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "worker",
    "kycStatus": "unsubmitted"
  },
  "token": "header.payload.signature"
}
```

### 2. Login
**POST** `/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "strongpassword123"
}
```
- **Response (200):**
```json
{
  "user": { "id": 1, "name": "John Doe", "role": "worker" },
  "token": "header.payload.signature"
}
```

### 3. Get Me
**GET** `/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "worker",
    "kycStatus": "unsubmitted"
  }
}
```

---

## Jobs
Base URL: `/api/jobs`

### 1. List Jobs (Public)
**GET** `/`
- **Query Params:** `page`, `limit`, `search`, `location`, `minWage`, `maxWage`
- **Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Graphic Designer",
      "wage": "500.00",
      "location": "Jakarta",
      "status": "open",
      "employer": { "id": 2, "name": "Company A" }
    }
  ],
  "meta": { "total": 1, "page": 1, "totalPages": 1 }
}
```

### 2. Create Job
**POST** `/`
- **Auth Required:** Employer
- **Body:**
```json
{
  "title": "Graphic Designer",
  "description": "Designing logos and marketing materials.",
  "wage": 500.00,
  "location": "Jakarta",
  "requirements": ["Adobe Photoshop", "Illustrator"]
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": { "id": 1, "title": "Graphic Designer" }
}
```

### 3. Update Job
**PATCH** `/:id`
- **Auth Required:** Employer (Owner)
- **Body:** (Any field from create job)
- **Response (200):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": { "id": 1, "title": "Graphic Designer" }
}
```

### 4. Publish Job
**POST** `/:id/publish`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Job published successfully",
  "data": { "id": 1, "status": "open" }
}
```

### 5. Close Job
**POST** `/:id/close`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Job closed successfully"
}
```

### 6. Cancel Job
**POST** `/:id/cancel`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Job cancelled successfully"
}
```

### 7. Delete Job
**DELETE** `/:id`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## Applications
Base URL: `/api`

### 1. Apply to Job
**POST** `/jobs/:id/apply`
- **Auth Required:** Worker
- **Body:**
```json
{
  "coverLetter": "I have 5 years of experience in Graphic Design."
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": { "id": 1, "jobId": 1, "status": "submitted" }
}
```

### 2. List Applications for Job
**GET** `/jobs/:id/applications`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "worker": { "id": 3, "name": "Jane Doe" },
      "coverLetter": "...",
      "status": "submitted"
    }
  ]
}
```

### 3. Accept Application
**POST** `/applications/:id/accept`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Application accepted and contract created",
  "data": { "id": 1, "contractNumber": "CON-170494...", "status": "draft" }
}
```

### 4. Reject Application
**POST** `/applications/:id/reject`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Application rejected"
}
```

### 5. Withdraw Application
**POST** `/applications/:id/withdraw`
- **Auth Required:** Worker (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Application withdrawn"
}
```

---

## Contracts
Base URL: `/api/contracts`

### 1. Get My Contracts
**GET** `/`
- **Auth Required:** Any (Worker/Employer)
- **Response (200):**
```json
{
  "success": true,
  "data": [{ "id": 1, "contractNumber": "...", "status": "active" }]
}
```

### 2. Activate Contract
**POST** `/:id/activate`
- **Auth Required:** Either Party
- **Response (200):**
```json
{
  "success": true,
  "message": "Contract activated successfully",
  "data": { }
}
```

### 3. Approve Contract
**POST** `/:id/approve`
- **Auth Required:** Worker (Assigned)
- **Response (200):**
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

### 4. Complete Contract
**POST** `/:id/complete`
- **Auth Required:** Employer (Owner)
- **Response (200):**
```json
{
  "success": true,
  "message": "Contract completed successfully"
}
```

### 5. Cancel Contract
**POST** `/:id/cancel`
- **Auth Required:** Either Party
- **Response (200):**
```json
{
  "success": true,
  "message": "Contract cancelled"
}
```

---

## Payments & Wallet
Base URL: `/api`

### 1. My Wallet
**GET** `/wallet/me`
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "balance": "1000.00",
    "lockedBalance": "0.00"
  }
}
```

### 2. My Wallet Transactions
**GET** `/wallet/tx`
- **Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "amount": "500.00", "type": "escrow_fund", "status": "success" }
  ]
}
```

### 3. Fund Escrow
**POST** `/contracts/:id/escrow/fund`
- **Auth Required:** Employer
- **Response (201):**
```json
{
  "success": true,
  "message": "Escrow funded",
  "data": { "id": 1, "type": "escrow_fund" }
}
```

### 4. Release Escrow
**POST** `/contracts/:id/escrow/release`
- **Auth Required:** Employer
- **Response (200):**
```json
{
  "success": true,
  "message": "Escrow released"
}
```

### 5. Refund Escrow
**POST** `/contracts/:id/escrow/refund`
- **Auth Required:** Employer
- **Response (200):**
```json
{
  "success": true,
  "message": "Escrow refunded"
}
```

### 6. Withdrawal Request
**POST** `/wallet/withdrawals`
- **Auth Required:** Any
- **Body:** `{ "amount": 100 }`
- **Response (201):**
```json
{
  "success": true,
  "message": "Withdrawal request submitted"
}
```

### 7. Approve Withdrawal
**POST** `/withdrawals/:id/approve`
- **Auth Required:** Admin
- **Response (200):**
```json
{
  "success": true,
  "message": "Withdrawal approved"
}
```

---

## Notifications
Base URL: `/api/notifications`

### 1. List Notifications
**GET** `/`
- **Response (200):**
```json
{
  "success": true,
  "data": [{ "id": 1, "message": "New application received", "isRead": false }]
}
```

---

## Ratings
Base URL: `/api`

### 1. Submit Rating
**POST** `/jobs/:id/ratings`
- **Body:**
```json
{
  "score": 5,
  "comment": "Excellent work!"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": { "id": 1, "score": 5 }
}
```

### 2. Get Job Ratings
**GET** `/jobs/:id/ratings`
- **Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "score": 5, "comment": "...", "fromUser": { "name": "..." } }
  ]
}
```

---

## Chain Transactions
Base URL: `/api/chain-tx`

### 1. Get Chain Transaction
**GET** `/:id`
- **Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "chainTxHash": "0x...",
    "status": "confirmed",
    "network": "base_mainnet"
  }
}
```

### 2. Reconcile Transactions (Sync)
**POST** `/reconcile`
- **Auth Required:** Admin
- **Response (200):**
```json
{
  "success": true,
  "message": "Reconciliation completed"
}
```
