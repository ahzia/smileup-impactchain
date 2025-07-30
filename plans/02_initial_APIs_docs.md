# SmileUp ImpactChain — Initial API Documentation (MVP)

This document outlines the minimal set of APIs required for the frontend MVP, based on the concept, requirements, and UI drafts. These endpoints are designed for rapid prototyping and can be extended as the product evolves.

---

## 1. **Authentication & User APIs**

### `POST /api/auth/login`
- **Purpose:** User login (email/password or social)
- **Request:**
  ```json
  { "email": "string", "password": "string" }
  ```
- **Response:**
  ```json
  { "token": "jwt", "user": { "id": "string", "name": "string", "avatar": "url", "smiles": 100, "level": 1 } }
  ```

### `POST /api/auth/register`
- **Purpose:** User registration
- **Request:**
  ```json
  { "name": "string", "email": "string", "password": "string" }
  ```
- **Response:**
  ```json
  { "token": "jwt", "user": { "id": "string", "name": "string", "avatar": "url", "smiles": 100, "level": 1 } }
  ```

### `GET /api/user/profile`
- **Purpose:** Fetch current user profile
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "id": "string", "name": "string", "avatar": "url", "smiles": 100, "level": 1, "badges": ["string"], "history": { "missions": [], "donations": [], "redemptions": [] } }
  ```

---

## 2. **Impact Feed APIs**

### `GET /api/feed`
- **Purpose:** Fetch paginated impact feed (videos/images)
- **Query:** `?page=1&pageSize=10`
- **Response:**
  ```json
  [
    { "id": "string", "mediaType": "video|image", "mediaUrl": "url", "title": "string", "description": "string", "ngo": { "id": "string", "name": "string" }, "smiles": 42, "commentsCount": 3 }
  ]
  ```

### `POST /api/feed/:id/donate`
- **Purpose:** Donate Smiles to a project/NGO from the feed
- **Request:**
  ```json
  { "amount": 10 }
  ```
- **Response:**
  ```json
  { "success": true, "newBalance": 90, "newProjectSmiles": 52 }
  ```

---

## 3. **Missions/Quests APIs**

### `GET /api/missions`
- **Purpose:** List available missions (filterable)
- **Query:** `?type=daily|weekly|featured`
- **Response:**
  ```json
  [
    { "id": "string", "title": "string", "description": "string", "reward": 10, "status": "available|accepted|completed", "proofRequired": true }
  ]
  ```

### `POST /api/missions/:id/accept`
- **Purpose:** Accept a mission
- **Response:**
  ```json
  { "success": true, "mission": { "id": "string", "status": "accepted" } }
  ```

### `POST /api/missions/:id/complete`
- **Purpose:** Complete a mission (with proof)
- **Request:**
  ```json
  { "proofType": "image|video|text", "proofUrl": "url or text" }
  ```
- **Response:**
  ```json
  { "success": true, "reward": 10, "newBalance": 110, "mission": { "id": "string", "status": "completed" } }
  ```

---

## 4. **Bazaar/Rewards APIs**

### `GET /api/rewards`
- **Purpose:** List available rewards (NFTs, merch, vouchers)
- **Query:** `?category=nft|merch|voucher`
- **Response:**
  ```json
  [
    { "id": "string", "type": "nft|merch|voucher", "title": "string", "image": "url", "cost": 100, "owned": false }
  ]
  ```

### `POST /api/rewards/:id/redeem`
- **Purpose:** Redeem a reward
- **Response:**
  ```json
  { "success": true, "newBalance": 0, "reward": { "id": "string", "type": "nft|merch|voucher" } }
  ```

---

## 5. **Leaderboard APIs**

### `GET /api/leaderboard`
- **Purpose:** Fetch top users by Smiles/XP
- **Response:**
  ```json
  [
    { "id": "string", "name": "string", "avatar": "url", "smiles": 200, "level": 5 }
  ]
  ```

---

## 6. **Miscellaneous APIs**

### `GET /api/challenges`
- **Purpose:** List current bonus challenges/top-up offers
- **Response:**
  ```json
  [
    { "id": "string", "title": "string", "reward": 20, "type": "streak|referral|special" }
  ]
  ```

---

## Notes
- All endpoints assume JWT-based authentication unless otherwise noted.
- File uploads (proof, avatar) can use presigned URLs or multipart/form-data as needed.
- These APIs are designed for MVP and can be extended for future features (chat, notifications, admin, etc.). 