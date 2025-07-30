SmileUp ImpactChain — UI & Interaction Specifications

This document details the user interface and interaction design for SmileUp ImpactChain, focusing on core user journeys, screen layouts, and UX behaviors for the Hackathon MVP and beyond.

1. Navigation & Global Components

Bottom Tab Bar (mobile-first)

Feed (Home icon)

Quests (Clipboard icon)

Bazaar (Shop icon)

Profile (User icon)

Top‑Up Floating Button

Appears near Smiles balance in Feed and Profile pages

Opens Top‑Up modal for mission suggestions & purchase

Global Header

Current page title

Notifications bell (for mission invites, approvals)

Wallet connect status (connected account or “Connect Wallet” CTA)

Theme & Branding

Primary Colors: #3DBE29 (Green), #FFD700 (Gold)

Accent Colors: #1F1F1F (Dark), #FFFFFF (White)

Typography: Bold headlines, rounded sans-serif body text

Iconography: Simple line icons with filled states on active

2. Impact Feed Page

Layout & Elements

Vertical Scroll List of Post Cards

Media: Full‑width video (auto-play muted) or image carousel

Overlay Buttons (bottom left/right):• Smile Donate (heart/leaf icon + count)• Comments (speech bubble icon)• Share (share icon)

Tap Media → Full‑Screen Modal

Detailed description, NGO info, donate CTA, comments feed

Floating + Button (bottom center)

Opens Top‑Up modal

Interactions

Infinite Scroll: load 5–7 posts at a time

Double‑tap Smile: quick donate + animation (burst of leaves)

Swipe Up/Down: navigate between posts (snap to center)

3. Quests Page

Layout & Elements

Tab Bar (top): Daily | Weekly | Featured

Mission Cards (list/grid)

Title & Icon (e.g., recycle bin, volunteer hands)

Description (1–2 lines)

Reward Chip: +X Smiles (gold token icon)

Action Button:• Accept (if not started)• Complete (if accepted; on click opens proof upload)• Donate (for supporting mission financially)

Proof Submission

Modal: upload photo/video or short text

AI/Peer Review: show status indicator (Pending → Approved)

Success Screen: confetti + “You earned X Smiles!” toast

4. Bazaar Page

Layout & Elements

Search & Filter: category dropdown (NFTs, Merchandise, Vouchers)

Catalog Grid of Item Cards

Image/NFT Preview

Title & Price (in Smiles)

Ownership Badge (if owned)

Item Detail Modal

Expanded images carousel

Description & issuer info

Redeem/Stake button (disabled if insufficient Smiles)

Transaction Confirmation: animation of token burning + success

5. Profile Page

Layout & Elements

Header: User avatar, username, wallet connect button

Balance Card:

Smiles Balance + + Button for Top‑Up

XP Level Bar with level number

Badges & NFTs: horizontal scroll of collectible badges

History Tabs:  Missions | Donations | Redemptions

List view with date, title, amount, and status

Settings Icon: profile settings, dark mode toggle

6. Top‑Up Modal

Layout & Elements

Close (X) Button

Mission Suggestions: list of 3–5 auto-created engagement missions

Earn Buttons: “Complete to earn +X Smiles” CTA per mission

Purchase Section: tiered bundles (100 Smiles for $1, etc.)

Interactions

Tap Mission → navigates to Quests page with filter applied

Purchase → calls mock or Stripe API → updates balance + animation

7. Responsive & Accessibility

Mobile-first design, optimized for iOS & Android browsers

Accessible labels on buttons, color contrast ratios >4.5:1

Keyboard navigation for desktop view, focus outlines, ARIA roles

This UI spec ensures a consistent, engaging user experience across SmileUp ImpactChain’s core pages—balancing social feed, mission-driven engagement, and circular token utility.

