export interface Reward {
  id: string;
  type: "experience" | "certificate" | "digital" | "event" | "voucher" | "award" | "discount" | "merchandise" | "service";
  title: string;
  description: string;
  validity: string;
  cost: number;
  provider: string;
  owned: boolean;
  emoji: string;
  imageUrl: string;
  community: {
    id: string;
    name: string;
    logo: string;
  };
}

export const rewards: Reward[] = [
  // SmileUp System Rewards
  {
    id: "reward_001",
    type: "digital",
    title: "Early Adopter Badge",
    description: "Exclusive digital badge for being one of the first users of SmileUp ImpactChain. Show your commitment to social impact from day one.",
    validity: "Never Expires",
    cost: 100,
    provider: "SmileUp",
    owned: false,
    emoji: "🏅",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_002",
    type: "certificate",
    title: "Impact Leader Certificate",
    description: "Official certificate recognizing your contributions to community impact and social change. Perfect for resumes and portfolios.",
    validity: "Never Expires",
    cost: 250,
    provider: "SmileUp",
    owned: false,
    emoji: "📜",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_003",
    type: "merchandise",
    title: "SmileUp Impact T-Shirt",
    description: "High-quality organic cotton t-shirt featuring the SmileUp logo and a message of social impact. Available in multiple sizes.",
    validity: "Valid until December 31, 2025",
    cost: 150,
    provider: "SmileUp",
    owned: false,
    emoji: "👕",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },

  // Green Earth Initiative Rewards
  {
    id: "reward_004",
    type: "experience",
    title: "Guided Nature Hike",
    description: "Join a professional naturalist for a guided hike through protected wilderness areas. Learn about local ecosystems and conservation efforts.",
    validity: "Valid until December 31, 2024",
    cost: 300,
    provider: "Green Earth Initiative",
    owned: false,
    emoji: "🌲",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop",
    community: {
      id: "comm_001",
      name: "Green Earth Initiative",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_005",
    type: "certificate",
    title: "Environmental Stewardship Certificate",
    description: "Certificate recognizing your contributions to environmental conservation and sustainable practices.",
    validity: "Never Expires",
    cost: 200,
    provider: "Green Earth Initiative",
    owned: false,
    emoji: "🌍",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
    community: {
      id: "comm_001",
      name: "Green Earth Initiative",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    }
  },

  // Tech for Social Impact Rewards
  {
    id: "reward_006",
    type: "event",
    title: "Tech for Good Conference Pass",
    description: "Free pass to attend our annual Tech for Good conference featuring speakers from leading tech companies and nonprofits.",
    validity: "Valid until October 15, 2024",
    cost: 400,
    provider: "Tech for Social Impact",
    owned: false,
    emoji: "💻",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "comm_002",
      name: "Tech for Social Impact",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_007",
    type: "service",
    title: "Code Review Session",
    description: "One-hour code review session with senior developers to improve your programming skills and project quality.",
    validity: "Valid until December 31, 2024",
    cost: 150,
    provider: "Tech for Social Impact",
    owned: false,
    emoji: "🔍",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "comm_002",
      name: "Tech for Social Impact",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },

  // Student Environmentalists Network Rewards
  {
    id: "reward_008",
    type: "award",
    title: "Student Activist Award",
    description: "Recognition award for outstanding student leadership in environmental activism and campus sustainability initiatives.",
    validity: "Never Expires",
    cost: 100,
    provider: "Student Environmentalists Network",
    owned: false,
    emoji: "🎓",
    imageUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=300&h=300&fit=crop",
    community: {
      id: "comm_003",
      name: "Student Environmentalists Network",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_009",
    type: "experience",
    title: "Campus Sustainability Tour",
    description: "Guided tour of sustainable initiatives on university campuses, including green buildings, renewable energy, and waste management systems.",
    validity: "Valid until December 31, 2024",
    cost: 75,
    provider: "Student Environmentalists Network",
    owned: false,
    emoji: "🏫",
    imageUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=300&h=300&fit=crop",
    community: {
      id: "comm_003",
      name: "Student Environmentalists Network",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    }
  },

  // Local Arts Collective Rewards
  {
    id: "reward_010",
    type: "experience",
    title: "Artist Workshop Session",
    description: "One-on-one workshop session with a local artist to learn new techniques and develop your creative skills.",
    validity: "Valid until December 31, 2024",
    cost: 200,
    provider: "Local Arts Collective",
    owned: false,
    emoji: "🎨",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "comm_004",
      name: "Local Arts Collective",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_011",
    type: "merchandise",
    title: "Local Artist Print",
    description: "Limited edition print from a local artist, featuring original artwork that celebrates community and culture.",
    validity: "Valid until December 31, 2024",
    cost: 120,
    provider: "Local Arts Collective",
    owned: false,
    emoji: "🖼️",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "comm_004",
      name: "Local Arts Collective",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },

  // Community Health Advocates Rewards
  {
    id: "reward_012",
    type: "service",
    title: "Health Consultation Session",
    description: "Free health consultation session with a healthcare professional to discuss wellness and preventive care.",
    validity: "Valid until December 31, 2024",
    cost: 250,
    provider: "Community Health Advocates",
    owned: false,
    emoji: "🏥",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_013",
    type: "event",
    title: "Wellness Retreat Pass",
    description: "Weekend wellness retreat featuring yoga, meditation, nutrition workshops, and community building activities.",
    validity: "Valid until November 30, 2024",
    cost: 500,
    provider: "Community Health Advocates",
    owned: false,
    emoji: "🧘",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    }
  },

  // Urban Garden Network Rewards
  {
    id: "reward_014",
    type: "experience",
    title: "Garden Design Consultation",
    description: "Professional consultation to help you design and start your own urban garden, including plant selection and maintenance tips.",
    validity: "Valid until December 31, 2024",
    cost: 180,
    provider: "Urban Garden Network",
    owned: false,
    emoji: "🌱",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
    community: {
      id: "comm_006",
      name: "Urban Garden Network",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_015",
    type: "merchandise",
    title: "Garden Starter Kit",
    description: "Complete starter kit including seeds, soil, pots, and gardening tools to begin your urban gardening journey.",
    validity: "Valid until December 31, 2024",
    cost: 100,
    provider: "Urban Garden Network",
    owned: false,
    emoji: "🪴",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
    community: {
      id: "comm_006",
      name: "Urban Garden Network",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop"
    }
  },

  // Green Tech Innovators Rewards
  {
    id: "reward_016",
    type: "experience",
    title: "Solar Panel Installation Workshop",
    description: "Hands-on workshop to learn about solar panel installation, renewable energy systems, and sustainable technology.",
    validity: "Valid until December 31, 2024",
    cost: 350,
    provider: "Green Tech Innovators",
    owned: false,
    emoji: "☀️",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "comm_007",
      name: "Green Tech Innovators",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_017",
    type: "certificate",
    title: "Sustainable Technology Certificate",
    description: "Certificate recognizing expertise in sustainable technology solutions and renewable energy systems.",
    validity: "Never Expires",
    cost: 300,
    provider: "Green Tech Innovators",
    owned: false,
    emoji: "⚡",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    community: {
      id: "comm_007",
      name: "Green Tech Innovators",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },

  // Mental Health Awareness Rewards
  {
    id: "reward_018",
    type: "service",
    title: "Mental Health First Aid Training",
    description: "Comprehensive training to recognize and respond to mental health challenges in your community.",
    validity: "Valid until December 31, 2024",
    cost: 400,
    provider: "Mental Health Awareness",
    owned: false,
    emoji: "🧠",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    community: {
      id: "comm_008",
      name: "Mental Health Awareness",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_019",
    type: "event",
    title: "Mindfulness Workshop Series",
    description: "Six-week series of mindfulness workshops to develop stress management and emotional well-being skills.",
    validity: "Valid until December 31, 2024",
    cost: 250,
    provider: "Mental Health Awareness",
    owned: false,
    emoji: "🧘",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    community: {
      id: "comm_008",
      name: "Mental Health Awareness",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    }
  },

  // Digital Learning Hub Rewards
  {
    id: "reward_020",
    type: "service",
    title: "Coding Bootcamp Scholarship",
    description: "Partial scholarship for our intensive coding bootcamp, helping you develop in-demand programming skills.",
    validity: "Valid until December 31, 2024",
    cost: 800,
    provider: "Digital Learning Hub",
    owned: false,
    emoji: "💻",
    imageUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=300&h=300&fit=crop",
    community: {
      id: "comm_010",
      name: "Digital Learning Hub",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    }
  },
  {
    id: "reward_021",
    type: "certificate",
    title: "Digital Literacy Certificate",
    description: "Certificate recognizing proficiency in digital skills, computer literacy, and technology fundamentals.",
    validity: "Never Expires",
    cost: 150,
    provider: "Digital Learning Hub",
    owned: false,
    emoji: "📱",
    imageUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=300&h=300&fit=crop",
    community: {
      id: "comm_010",
      name: "Digital Learning Hub",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    }
  }
]; 