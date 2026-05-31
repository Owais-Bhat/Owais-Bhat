# CyberMilo Admin API

Secure backend for SaaS/platform account operations. This server uses the Supabase service-role key, so it must run server-side only.

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Required env:

```text
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in the Vite frontend.

## Auth

Every `/api/admin/*` endpoint requires:

```text
Authorization: Bearer <supabase-user-access-token>
```

The backend verifies the token, loads `user_profiles`, and allows only active users with:

```text
role = super_admin
```

## Endpoints

### GET `/api/admin/institutions`

Returns all institutions plus user counts.

### POST `/api/admin/institutions`

Creates an institution, creates its first `institution_admin` auth user, and inserts a linked profile.

Body:

```json
{
  "name": "Green Valley School",
  "type": "School",
  "email": "school@example.com",
  "phone": "9999999999",
  "address": "Full address",
  "subscription_plan": "free",
  "adminEmail": "admin@example.com",
  "adminPassword": "ChangeMe123",
  "adminFirstName": "School",
  "adminLastName": "Admin"
}
```

### POST `/api/admin/invite-user`

Invites a user into an institution and creates/updates their profile.

Body:

```json
{
  "institutionId": "uuid",
  "email": "teacher@example.com",
  "role": "teacher",
  "firstName": "Ayesha",
  "lastName": "Khan",
  "redirectTo": "http://localhost:5173/login"
}
```

### POST `/api/admin/change-plan`

Updates an institution subscription plan.

Body:

```json
{
  "institutionId": "uuid",
  "plan": "growth"
}
```

Allowed plans: `free`, `starter`, `growth`, `pro`, `enterprise`.

### POST `/api/admin/suspend-institution`

Stores suspension state in `institutions.settings` and activates/deactivates all tenant users.

Body:

```json
{
  "institutionId": "uuid",
  "suspended": true,
  "reason": "Payment overdue"
}
```
