export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: "streak" | "referral" | "special" | "community";
  deadline: string;
  progress: "Not Started" | "In Progress" | "Completed";
  requirements?: string[];
  steps?: number;
  currentStep?: number;
}

export const challenges: Challenge[] = [
  // Streak Challenges
  {
    id: "challenge_001",
    title: "7-Day Mission Streak",
    description: "Complete at least one mission every day for 7 consecutive days to build consistent impact habits.",
    reward: 100,
    type: "streak",
    deadline: "2024-03-23T23:59:59Z",
    progress: "In Progress",
    requirements: ["Complete 1 mission per day", "Maintain streak for 7 days"],
    steps: 7,
    currentStep: 3
  },
  {
    id: "challenge_002",
    title: "30-Day Impact Streak",
    description: "Make a positive impact every day for 30 days. This could be completing missions, donating Smiles, or participating in community events.",
    reward: 500,
    type: "streak",
    deadline: "2024-04-15T23:59:59Z",
    progress: "Not Started",
    requirements: ["Daily impact activity", "Maintain streak for 30 days"],
    steps: 30,
    currentStep: 0
  },

  // Referral Challenges
  {
    id: "challenge_003",
    title: "Community Builder",
    description: "Invite 5 friends to join SmileUp and help them complete their first mission. Grow our community of changemakers!",
    reward: 200,
    type: "referral",
    deadline: "2024-03-30T23:59:59Z",
    progress: "In Progress",
    requirements: ["Invite 5 friends", "Help them complete first mission"],
    steps: 5,
    currentStep: 2
  },
  {
    id: "challenge_004",
    title: "Social Impact Ambassador",
    description: "Refer 10 new users to SmileUp and help them get started with their impact journey.",
    reward: 400,
    type: "referral",
    deadline: "2024-04-10T23:59:59Z",
    progress: "Not Started",
    requirements: ["Refer 10 users", "Guide them through onboarding"],
    steps: 10,
    currentStep: 0
  },

  // Special Challenges
  {
    id: "challenge_005",
    title: "Earth Day Impact Challenge",
    description: "Celebrate Earth Day by completing environmental missions and making a significant impact on our planet.",
    reward: 300,
    type: "special",
    deadline: "2024-04-22T23:59:59Z",
    progress: "Not Started",
    requirements: ["Complete 5 environmental missions", "Plant 3 trees", "Participate in cleanup event"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_006",
    title: "Community Hero",
    description: "Complete missions from 5 different communities to show your commitment to diverse causes and impact areas.",
    reward: 250,
    type: "special",
    deadline: "2024-03-25T23:59:59Z",
    progress: "In Progress",
    requirements: ["Complete missions from 5 communities", "Document your impact"],
    steps: 5,
    currentStep: 2
  },
  {
    id: "challenge_007",
    title: "Digital Impact Pioneer",
    description: "Be among the first to explore and provide feedback on new digital features and community tools.",
    reward: 150,
    type: "special",
    deadline: "2024-03-20T23:59:59Z",
    progress: "Not Started",
    requirements: ["Test new features", "Provide detailed feedback", "Share with community"],
    steps: 3,
    currentStep: 0
  },

  // Community Challenges
  {
    id: "challenge_008",
    title: "Green Earth Initiative Supporter",
    description: "Complete 3 environmental missions from Green Earth Initiative and donate 100 Smiles to their cause.",
    reward: 180,
    type: "community",
    deadline: "2024-03-28T23:59:59Z",
    progress: "Not Started",
    requirements: ["Complete 3 Green Earth missions", "Donate 100 Smiles"],
    steps: 2,
    currentStep: 0
  },
  {
    id: "challenge_009",
    title: "Tech for Social Impact Advocate",
    description: "Participate in a hackathon, teach a digital literacy workshop, and mentor a new tech volunteer.",
    reward: 350,
    type: "community",
    deadline: "2024-04-05T23:59:59Z",
    progress: "Not Started",
    requirements: ["Join hackathon", "Teach workshop", "Mentor volunteer"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_010",
    title: "Student Environmentalist Leader",
    description: "Organize a campus sustainability event, recruit 10 new student members, and implement a green initiative.",
    reward: 400,
    type: "community",
    deadline: "2024-04-12T23:59:59Z",
    progress: "Not Started",
    requirements: ["Organize campus event", "Recruit 10 students", "Implement green initiative"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_011",
    title: "Local Arts Collective Creator",
    description: "Create an original artwork, participate in a community art event, and teach an art workshop to children.",
    reward: 280,
    type: "community",
    deadline: "2024-03-30T23:59:59Z",
    progress: "Not Started",
    requirements: ["Create artwork", "Participate in event", "Teach workshop"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_012",
    title: "Community Health Champion",
    description: "Facilitate a health workshop, conduct a wellness survey, and organize a community health screening event.",
    reward: 320,
    type: "community",
    deadline: "2024-04-08T23:59:59Z",
    progress: "Not Started",
    requirements: ["Facilitate workshop", "Conduct survey", "Organize screening"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_013",
    title: "Urban Garden Master",
    description: "Design and maintain a community garden plot, teach composting techniques, and harvest produce for local food bank.",
    reward: 220,
    type: "community",
    deadline: "2024-04-15T23:59:59Z",
    progress: "Not Started",
    requirements: ["Maintain garden plot", "Teach composting", "Donate produce"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_014",
    title: "Green Tech Innovator",
    description: "Install solar panels on a community building, conduct an energy audit, and teach renewable energy workshop.",
    reward: 450,
    type: "community",
    deadline: "2024-04-20T23:59:59Z",
    progress: "Not Started",
    requirements: ["Install solar panels", "Conduct energy audit", "Teach workshop"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_015",
    title: "Mental Health Advocate",
    description: "Complete mental health first aid training, facilitate a support group, and create mental health awareness content.",
    reward: 380,
    type: "community",
    deadline: "2024-04-10T23:59:59Z",
    progress: "Not Started",
    requirements: ["Complete training", "Facilitate support group", "Create awareness content"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_016",
    title: "Digital Literacy Champion",
    description: "Teach 5 seniors to use technology, develop a digital skills curriculum, and organize a tech donation drive.",
    reward: 300,
    type: "community",
    deadline: "2024-04-05T23:59:59Z",
    progress: "Not Started",
    requirements: ["Teach 5 seniors", "Develop curriculum", "Organize donation drive"],
    steps: 3,
    currentStep: 0
  },

  // Weekly Challenges
  {
    id: "challenge_017",
    title: "Weekly Impact Explorer",
    description: "Try missions from 3 different categories this week to explore diverse impact opportunities.",
    reward: 120,
    type: "special",
    deadline: "2024-03-23T23:59:59Z",
    progress: "In Progress",
    requirements: ["Complete missions from 3 categories", "Document your experiences"],
    steps: 3,
    currentStep: 1
  },
  {
    id: "challenge_018",
    title: "Social Media Impact",
    description: "Share your SmileUp impact stories on social media and inspire others to join the movement.",
    reward: 80,
    type: "special",
    deadline: "2024-03-23T23:59:59Z",
    progress: "Not Started",
    requirements: ["Share 3 impact stories", "Use #SmileUpImpact", "Tag 5 friends"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_019",
    title: "Community Feedback Provider",
    description: "Provide detailed feedback on 5 different community features and help improve the SmileUp experience.",
    reward: 100,
    type: "special",
    deadline: "2024-03-23T23:59:59Z",
    progress: "Not Started",
    requirements: ["Test 5 features", "Provide detailed feedback", "Suggest improvements"],
    steps: 3,
    currentStep: 0
  },
  {
    id: "challenge_020",
    title: "SmileUp Ambassador",
    description: "Represent SmileUp at a local event, share your impact story, and recruit new community members.",
    reward: 200,
    type: "special",
    deadline: "2024-03-30T23:59:59Z",
    progress: "Not Started",
    requirements: ["Attend local event", "Share impact story", "Recruit 3 new members"],
    steps: 3,
    currentStep: 0
  }
]; 