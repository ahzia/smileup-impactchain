# SmileUp ImpactChain — Initial API Documentation (MVP)

This document outlines the minimal set of APIs required for the frontend MVP, based on the concept, requirements, UI drafts, and analysis of existing codebases. These endpoints are designed for rapid prototyping and can be extended as the product evolves.

**Community Concept:** Communities are organizations (NGOs, schools, local organizations, etc.) that post videos, create missions, offer rewards, and organize activities. Users can join communities as members, support their projects, or create their own communities.

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
  { 
    "token": "jwt", 
    "user": { 
      "id": "string", 
      "name": "string", 
      "email": "string",
      "avatar": "url", 
      "smiles": 100, 
      "level": 1, 
      "score": 100,
      "bio": "string",
      "interests": ["string"],
      "friends": 12,
      "communitiesJoined": ["string"],
      "communitiesCreated": ["string"]
    } 
  }
  ```

### `POST /api/auth/register`
- **Purpose:** User registration
- **Request:**
  ```json
  { "name": "string", "email": "string", "password": "string", "bio": "string", "interests": ["string"] }
  ```
- **Response:**
  ```json
  { 
    "token": "jwt", 
    "user": { 
      "id": "string", 
      "name": "string", 
      "email": "string",
      "avatar": "url", 
      "smiles": 100, 
      "level": 1, 
      "score": 100,
      "bio": "string",
      "interests": ["string"],
      "friends": 0,
      "communitiesJoined": [],
      "communitiesCreated": []
    } 
  }
  ```

### `GET /api/user/profile`
- **Purpose:** Fetch current user profile
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { 
    "id": "string", 
    "name": "string", 
    "email": "string",
    "avatar": "url", 
    "smiles": 100, 
    "level": 1, 
    "score": 100, 
    "bio": "string",
    "interests": ["string"],
    "friends": 12,
    "badges": ["string"], 
    "recentActivities": [
      { "activity": "string", "time": "string" }
    ],
    "history": { 
      "missions": [], 
      "donations": [], 
      "redemptions": [],
      "communitiesJoined": ["string"],
      "communitiesCreated": ["string"]
    } 
  }
  ```

### `PUT /api/user/profile`
- **Purpose:** Update user profile
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  { "name": "string", "bio": "string", "interests": ["string"], "avatar": "url" }
  ```
- **Response:**
  ```json
  { "success": true, "user": { "id": "string", "name": "string", "bio": "string", "interests": ["string"], "avatar": "url" } }
  ```

---

## 2. **Community APIs**

### `GET /api/communities`
- **Purpose:** List available communities
- **Query:** `?category=all|sustainability|education|health|environment&status=all|active|featured`
- **Response:**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "category": "string",
      "logo": "url",
      "banner": "url",
      "members": 150,
      "missions": 25,
      "totalSmiles": 5000,
      "status": "active|featured",
      "createdBy": "string",
      "createdAt": "timestamp",
      "location": "string",
      "website": "url"
    }
  ]
  ```

### `POST /api/communities`
- **Purpose:** Create a new community
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "name": "string",
    "description": "string",
    "category": "string",
    "logo": "url",
    "banner": "url",
    "location": "string",
    "website": "url"
  }
  ```
- **Response:**
  ```json
  { "success": true, "community": { "id": "string", "name": "string", "status": "active" } }
  ```

### `GET /api/communities/:id`
- **Purpose:** Get community details
- **Response:**
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "category": "string",
    "logo": "url",
    "banner": "url",
    "members": 150,
    "missions": 25,
    "totalSmiles": 5000,
    "status": "active",
    "createdBy": "string",
    "createdAt": "timestamp",
    "location": "string",
    "website": "url",
    "recentPosts": [
      { "id": "string", "title": "string", "mediaUrl": "url", "createdAt": "timestamp" }
    ],
    "recentMissions": [
      { "id": "string", "title": "string", "reward": 10, "status": "active" }
    ]
  }
  ```

### `POST /api/communities/:id/join`
- **Purpose:** Join a community
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "success": true, "community": { "id": "string", "status": "joined" } }
  ```

### `DELETE /api/communities/:id/leave`
- **Purpose:** Leave a community
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "success": true, "community": { "id": "string", "status": "left" } }
  ```

---

## 3. **Impact Feed APIs**

### `GET /api/feed`
- **Purpose:** Fetch paginated impact feed (videos/images from communities)
- **Query:** `?page=1&pageSize=10&category=all|sustainability|community|innovation&communityId=string`
- **Response:**
  ```json
  [
    { 
      "id": "string", 
      "mediaType": "video|image", 
      "mediaUrl": "url", 
      "title": "string", 
      "description": "string", 
      "community": {
        "id": "string",
        "name": "string",
        "logo": "url"
      },
      "challenge": "string",
      "callToAction": ["string"],
      "links": ["url"],
      "smiles": 42, 
      "commentsCount": 3,
      "likesCount": 15,
      "createdAt": "timestamp"
    }
  ]
  ```

### `POST /api/feed`
- **Purpose:** Create a new feed post (for community admins)
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "title": "string",
    "description": "string",
    "mediaType": "video|image",
    "mediaUrl": "url",
    "challenge": "string",
    "callToAction": ["string"],
    "links": ["url"],
    "communityId": "string"
  }
  ```
- **Response:**
  ```json
  { "success": true, "post": { "id": "string", "title": "string" } }
  ```

### `POST /api/feed/:id/donate`
- **Purpose:** Donate Smiles to a community project from the feed
- **Request:**
  ```json
  { "amount": 10 }
  ```
- **Response:**
  ```json
  { "success": true, "newBalance": 90, "newCommunitySmiles": 52 }
  ```

### `POST /api/feed/:id/like`
- **Purpose:** Like/unlike a feed item
- **Response:**
  ```json
  { "success": true, "liked": true, "likesCount": 16 }
  ```

### `POST /api/feed/:id/comment`
- **Purpose:** Add comment to feed item
- **Request:**
  ```json
  { "message": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "comment": { "id": "string", "message": "string", "userId": "string", "timestamp": "timestamp" } }
  ```

---

## 4. **Missions/Quests APIs**

### `GET /api/missions`
- **Purpose:** List available missions (filterable)
- **Query:** `?type=daily|weekly|featured|community&status=all|available|accepted|completed&communityId=string`
- **Response:**
  ```json
  [
    { 
      "id": "string", 
      "title": "string", 
      "description": "string", 
      "reward": 10, 
      "status": "available|accepted|completed", 
      "proofRequired": true,
      "deadline": "timestamp",
      "steps": 3,
      "currentStep": 1,
      "progress": "Not Started|In Progress|Completed",
      "effortLevel": "Low|Medium|High",
      "requiredTime": "string",
      "icon": "emoji",
      "category": "string",
      "community": {
        "id": "string",
        "name": "string",
        "logo": "url"
      }
    }
  ]
  ```

### `POST /api/missions`
- **Purpose:** Create a new mission (for community admins)
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "title": "string",
    "description": "string",
    "reward": 10,
    "proofRequired": true,
    "deadline": "timestamp",
    "effortLevel": "Low|Medium|High",
    "requiredTime": "string",
    "icon": "emoji",
    "category": "string",
    "communityId": "string"
  }
  ```
- **Response:**
  ```json
  { "success": true, "mission": { "id": "string", "title": "string" } }
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
  { "proofType": "image|video|text", "proofUrl": "url or text", "proofText": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "reward": 10, "newBalance": 110, "mission": { "id": "string", "status": "completed" } }
  ```

### `GET /api/missions/:id/progress`
- **Purpose:** Get mission progress for multi-step missions
- **Response:**
  ```json
  { "id": "string", "currentStep": 2, "totalSteps": 3, "progress": "In Progress" }
  ```

---

## 5. **Activities APIs**

### `GET /api/activities`
- **Purpose:** List available activities (volunteer opportunities)
- **Query:** `?communityId=string&effortLevel=Low|Medium|High`
- **Response:**
  ```json
  [
    {
      "activityId": "string",
      "communityId": "string",
      "name": "string",
      "description": "string",
      "reward": 50,
      "requiredTime": "4 hours",
      "effortLevel": "Medium",
      "status": "active|completed|pending",
      "deadline": "timestamp",
      "location": "string",
      "participants": 5,
      "maxParticipants": 10,
      "community": {
        "id": "string",
        "name": "string",
        "logo": "url"
      }
    }
  ]
  ```

### `POST /api/activities`
- **Purpose:** Create a new activity (for community admins)
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "name": "string",
    "description": "string",
    "reward": 50,
    "requiredTime": "4 hours",
    "effortLevel": "Medium",
    "deadline": "timestamp",
    "location": "string",
    "maxParticipants": 10,
    "communityId": "string"
  }
  ```
- **Response:**
  ```json
  { "success": true, "activity": { "id": "string", "name": "string" } }
  ```

### `POST /api/activities/:id/join`
- **Purpose:** Join an activity
- **Response:**
  ```json
  { "success": true, "activity": { "id": "string", "status": "joined" } }
  ```

---

## 6. **Bazaar/Rewards APIs**

### `GET /api/rewards`
- **Purpose:** List available rewards (NFTs, merch, vouchers)
- **Query:** `?category=nft|merch|voucher|experience|service&provider=all|community|smileup`
- **Response:**
  ```json
  [
    { 
      "id": "string", 
      "type": "experience|certificate|digital|event|voucher|award|discount|merchandise|service", 
      "title": "string",
      "description": "string",
      "validity": "string",
      "cost": 100, 
      "provider": "string",
      "owned": false,
      "emoji": "string",
      "imageUrl": "url",
      "community": {
        "id": "string",
        "name": "string",
        "logo": "url"
      }
    }
  ]
  ```

### `POST /api/rewards`
- **Purpose:** Create a new reward (for community admins)
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "title": "string",
    "description": "string",
    "type": "experience|certificate|digital|event|voucher|award|discount|merchandise|service",
    "cost": 100,
    "validity": "string",
    "emoji": "string",
    "imageUrl": "url",
    "communityId": "string"
  }
  ```
- **Response:**
  ```json
  { "success": true, "reward": { "id": "string", "title": "string" } }
  ```

### `POST /api/rewards/:id/redeem`
- **Purpose:** Redeem a reward
- **Response:**
  ```json
  { "success": true, "newBalance": 0, "reward": { "id": "string", "type": "string" } }
  ```

---

## 7. **Hubs/Chat APIs**

### `GET /api/hubs`
- **Purpose:** List available discussion hubs
- **Query:** `?category=all|sustainable-business|digital-innovation|lifestyle-wellness|cultural-experiences&communityId=string`
- **Response:**
  ```json
  [
    {
      "hub_id": "string",
      "name": "string",
      "description": "string",
      "created_by": "string",
      "category": "string",
      "image": "url",
      "participants": 12,
      "max_participants": 20,
      "community": {
        "id": "string",
        "name": "string",
        "logo": "url"
      },
      "recentMessages": [
        { "id": "string", "userId": "string", "message": "string", "timestamp": "timestamp" }
      ]
    }
  ]
  ```

### `POST /api/hubs`
- **Purpose:** Create a new hub (for community admins)
- **Headers:** `Authorization: Bearer <token>`
- **Request:**
  ```json
  {
    "name": "string",
    "description": "string",
    "category": "string",
    "image": "url",
    "max_participants": 20,
    "communityId": "string"
  }
  ```
- **Response:**
  ```json
  { "success": true, "hub": { "id": "string", "name": "string" } }
  ```

### `POST /api/hubs/:id/join`
- **Purpose:** Join a hub
- **Response:**
  ```json
  { "success": true, "hub": { "id": "string", "status": "joined" } }
  ```

### `POST /api/hubs/:id/message`
- **Purpose:** Send message to hub
- **Request:**
  ```json
  { "message": "string" }
  ```
- **Response:**
  ```json
  { "success": true, "message": { "id": "string", "message": "string", "userId": "string", "timestamp": "timestamp" } }
  ```

---

## 8. **Leaderboard APIs**

### `GET /api/leaderboard`
- **Purpose:** Fetch top users by Smiles/XP
- **Query:** `?period=all|weekly|monthly&limit=10`
- **Response:**
  ```json
  [
    { "id": "string", "name": "string", "avatar": "url", "smiles": 200, "level": 5, "score": 1500 }
  ]
  ```

---

## 9. **Challenges & Top-Up APIs**

### `GET /api/challenges`
- **Purpose:** List current bonus challenges/top-up offers
- **Query:** `?type=streak|referral|special|community`
- **Response:**
  ```json
  [
    { 
      "id": "string", 
      "title": "string", 
      "description": "string",
      "reward": 20, 
      "type": "streak|referral|special",
      "deadline": "timestamp",
      "progress": "Not Started|In Progress|Completed"
    }
  ]
  ```

### `POST /api/challenges/:id/claim`
- **Purpose:** Claim challenge reward
- **Response:**
  ```json
  { "success": true, "reward": 20, "newBalance": 120 }
  ```

---

## 10. **File Upload APIs**

### `POST /api/upload/avatar`
- **Purpose:** Upload user avatar
- **Request:** `multipart/form-data`
- **Response:**
  ```json
  { "success": true, "url": "url" }
  ```

### `POST /api/upload/proof`
- **Purpose:** Upload mission proof
- **Request:** `multipart/form-data`
- **Response:**
  ```json
  { "success": true, "url": "url" }
  ```

### `POST /api/upload/community-logo`
- **Purpose:** Upload community logo
- **Request:** `multipart/form-data`
- **Response:**
  ```json
  { "success": true, "url": "url" }
  ```

### `POST /api/upload/community-banner`
- **Purpose:** Upload community banner
- **Request:** `multipart/form-data`
- **Response:**
  ```json
  { "success": true, "url": "url" }
  ```

---

## Notes
- All endpoints assume JWT-based authentication unless otherwise noted.
- File uploads use multipart/form-data or presigned URLs as needed.
- These APIs are designed for MVP and can be extended for future features (notifications, admin, etc.).
- Community-specific features can be toggled based on business requirements.
- Users can join communities as members, support projects, or create their own communities. 