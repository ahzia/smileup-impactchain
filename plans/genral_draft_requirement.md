SmileUp ImpactChain — Project Requirements

This document outlines the full vision for SmileUp ImpactChain: a dual‑experience platform combining a social‑impact app (Impact Hub) and an optional game layer (Impact Play). It reflects the core pages, data flows, and integrations you’ll build in the hackathon and beyond.

🚀 High‑Level Navigation & Page Structure

Page

Purpose

Key Components

1. Impact Feed

TikTok‑style scroll of video/image posts from NGOs & peers.

• Infinite vertical scroll• Donate (Smile) button• + button for missions & top‑up

2. Quests

Browse & complete missions/tasks from followed organizations.

• Filter: Daily / Weekly / Featured• Mission cards: title, description, reward (Smiles)• Complete / Donate action

3. Bazaar

Redeem Smiles for NFTs, merchandise, vouchers or stake.

• Catalog grid• Item detail modal• Redeem / Stake button

4. Profile

Personal dashboard & wallet management.

• Smiles balance & + button• XP level, badges & NFTs• Completed missions, donation history• Wallet connect

5. Top‑Up

Access mission suggestions, purchase or earn bonus Smiles.

• List of recommended missions• In‑app purchase flow• Weekly challenge offers

🎯 Core Modules & Features

1) Impact Feed (Video Scroll)

Infinite Scroll of video/image content (static JSON → real backend).

Smile Button to donate Smiles directly to the featured project.

+ Button opens Top‑Up modal (see page 5).

Post Detail: Tap to see full description, comments, and donate option.

2) Quests (Mission Hub)

Mission List filtered by frequency (Daily / Weekly).

Mission Card: title, description, location tag, allocated reward (Smiles) deposited by organization.

Accept & Complete: Users opt-in, then upload proof (photo/video/text) → call POST /api/missions/:id/complete → transfer allocated Smiles from mission escrow to user.

Automatic App Missions: The platform can auto-create general engagement missions (no org) seeded with Smiles minted on registration; these missions draw from a central Smiles pool.

Initial Minting:

Users receive an initial allotment of Smiles on account creation (minted via HTS).

Organizations receive initial Smiles upon registration to seed their mission wallets.

Donate to Mission: Stake Smiles on mission success or support NGO campaigns.

Follow/Unfollow organizations to customize feed and quests.

3) Bazaar (Shop & Redeem)

Catalog of items: NFTs, branded merchandise, partner vouchers.

Item Detail: image carousel, description, cost in Smiles.

Redeem Flow: POST /api/redeem/:itemId → burn or transfer Smiles → receive NFT or voucher code.

4) Profile & Wallet

Smiles Balance (HTS tokens) with + Button to open Top‑Up page.

XP & Level: visual progress bar tied to missions + duels (if implemented).

Badges & NFTs: grid of collectible Impact Badges minted via HTS.

History Tabs: Missions completed, donations made, redemptions.

Wallet Integration: Connect via HashPack; show on‑chain account and explorer link.

5) Top‑Up & Challenges

Suggested Missions: personalized via AI agent or rule‑based logic.

Earn Bonus Smiles: special weekly/daily challenges (streaks, referrals).

Initial Mission Pool: System-generated missions funded by a central pool mint at launch.

Purchase Smiles (optional): in‑app purchase stub for demo; integrate Stripe or fiat‑on‑ramp later.

Organization Mission Creation: NGOs/stakeholders use their wallet to allocate Smiles as rewards when creating missions.

🔧 Technical Architecture

flowchart LR
  subgraph Frontend
    A[Impact Feed]
    B[Quests]
    C[Bazaar]
    D[Profile]
    E[Top‑Up]
  end

  subgraph Backend
    F[Next.js API Routes]
    G[Auth & Users]
    H[Missions & Projects]
    I[Economic Engine]
    J[Bazaar Service]
    K[Leaderboard & Stats]
  end

  subgraph Database[Supabase/Postgres]
    G & H & I & J & K
  end

  subgraph Hedera Layer
    L[HTS: Smiles & NFTs]
    M[HCS: Mission & Donation Logs]
  end

  Frontend --> F --> Database
  F --> L
  F --> M
  Frontend --> N[HashPack Wallet Integration]

⚙️ Integrations & Data Flow

Mission Creation by Org

UI/Admin: Org calls POST /api/missions with details + reward amount.

BE: Store mission, transfer reward allocation of Smiles from org wallet to mission escrow account via HTS, and log to HCS.

Mission Completion

UI: User taps Complete → uploads proof → calls /api/missions/:id/complete.

BE: Validate → store record → transfer Smiles from mission escrow to user via HTS → call HCS to log proof → update user balance.

Donate via Impact Feed

UI: Tap Smile button → calls /api/projects/:id/donate.

BE: Auth check → transfer Smiles from user to project wallet via HTS → call HCS → respond with new count.

Redeem in Bazaar

UI: Tap Redeem on item → calls /api/redeem/:itemId.

BE: Verify balance → burn or transfer Smiles → issue voucher/NFT → log to HCS.

Top‑Up & Challenges

UI: Opens Top‑Up page → fetch /api/challenges.

BE: Serve static or dynamic challenges; optionally trigger purchase flow or free bonus allocation via HTS.

Profile & Leaderboard

UI: Fetch /api/profile and /api/leaderboard.

BE: Aggregate data from DB & on‑chain balances; return sorted stats.

📈 Roadmap & Future Enhancements

Phase 1 (Hackathon MVP): Pages 1–5 with core flows, mock media, HTS transfers/proof logging in mission lifecycle.

Phase 2: AI mission suggestions; peer review workflows; richer NFT badge designs.

Phase 3: Impact Play card duels + guilds & seasonal tournaments.

Phase 4: Mobile apps; fiat‑on‑ramp; NGO partnerships; DAO governance for cause funding.

This document serves as your blueprint for both hackathon delivery and the full‑feature product—ensuring token flows are truly circular, transparent, and mission‑driven.

