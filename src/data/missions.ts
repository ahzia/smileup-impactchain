export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "available" | "accepted" | "completed";
  proofRequired: boolean;
  deadline: string;
  steps?: number;
  currentStep?: number;
  progress: "Not Started" | "In Progress" | "Completed";
  effortLevel: "Low" | "Medium" | "High";
  requiredTime: string;
  icon: string;
  category: string;
  community: {
    id: string;
    name: string;
    logo: string;
  };
}

export const missions: Mission[] = [
  // Daily Missions
  {
    id: "mission_001",
    title: "Watch Your First Impact Video",
    description: "Explore the SmileUp video feed and watch your first impact video to understand how communities are making a difference!",
    reward: 20,
    status: "available",
    proofRequired: false,
    deadline: "2024-03-16T23:59:59Z",
    progress: "Not Started",
    effortLevel: "Low",
    requiredTime: "5 minutes",
    icon: "📺",
    category: "daily",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_002",
    title: "Add 3 New Friends",
    description: "Connect with 3 new members in the SmileUp community to expand your network of changemakers.",
    reward: 15,
    status: "available",
    proofRequired: false,
    deadline: "2024-03-16T23:59:59Z",
    steps: 3,
    currentStep: 0,
    progress: "Not Started",
    effortLevel: "Low",
    requiredTime: "10 minutes",
    icon: "👥",
    category: "daily",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_003",
    title: "Use AI Assistant",
    description: "Ask a question or get help from the AI assistant about a specific project or community initiative.",
    reward: 10,
    status: "available",
    proofRequired: false,
    deadline: "2024-03-16T23:59:59Z",
    progress: "Not Started",
    effortLevel: "Low",
    requiredTime: "5 minutes",
    icon: "🤖",
    category: "daily",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },

  // Weekly Missions
  {
    id: "mission_004",
    title: "Participate in 3 Impact Events",
    description: "Engage in at least 3 community events or webinars this week to learn about different causes and initiatives.",
    reward: 50,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-23T23:59:59Z",
    steps: 3,
    currentStep: 0,
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "2 hours",
    icon: "🎭",
    category: "weekly",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_005",
    title: "Redeem a Reward",
    description: "Use your Smiles to redeem a special reward from the Bazaar and support community initiatives.",
    reward: 30,
    status: "available",
    proofRequired: false,
    deadline: "2024-03-23T23:59:59Z",
    progress: "Not Started",
    effortLevel: "Low",
    requiredTime: "10 minutes",
    icon: "🎁",
    category: "weekly",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_006",
    title: "Make 5 New Friends",
    description: "Connect with at least 5 new members on SmileUp to build your network of impact-driven individuals.",
    reward: 50,
    status: "available",
    proofRequired: false,
    deadline: "2024-03-23T23:59:59Z",
    steps: 5,
    currentStep: 0,
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "30 minutes",
    icon: "👥",
    category: "weekly",
    community: {
      id: "system",
      name: "SmileUp System",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },

  // Community Missions
  {
    id: "mission_007",
    title: "Beach Cleanup Mission",
    description: "Join our beach cleanup event and help remove plastic waste and marine debris from our local shoreline.",
    reward: 50,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-20T17:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "3 hours",
    icon: "🌊",
    category: "community",
    community: {
      id: "comm_001",
      name: "Green Earth Initiative",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_008",
    title: "Tree Planting Challenge",
    description: "Plant native trees in our community to restore local ecosystems and improve air quality.",
    reward: 75,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-18T16:00:00Z",
    progress: "Not Started",
    effortLevel: "High",
    requiredTime: "4 hours",
    icon: "🌳",
    category: "community",
    community: {
      id: "comm_001",
      name: "Green Earth Initiative",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_009",
    title: "Code for Good Hackathon",
    description: "Participate in our 48-hour hackathon to create technology solutions for local nonprofits.",
    reward: 100,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-25T18:00:00Z",
    progress: "Not Started",
    effortLevel: "High",
    requiredTime: "48 hours",
    icon: "💻",
    category: "community",
    community: {
      id: "comm_002",
      name: "Tech for Social Impact",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_010",
    title: "Digital Literacy Teaching",
    description: "Teach seniors how to use technology safely and effectively in our digital literacy program.",
    reward: 60,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-22T15:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "2 hours",
    icon: "📱",
    category: "community",
    community: {
      id: "comm_002",
      name: "Tech for Social Impact",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_011",
    title: "Campus Cleanup Mission",
    description: "Organize a campus-wide cleanup event to collect recyclable materials and promote waste reduction.",
    reward: 30,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-19T16:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "3 hours",
    icon: "♻️",
    category: "community",
    community: {
      id: "comm_003",
      name: "Student Environmentalists Network",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_012",
    title: "Recycling Drive Challenge",
    description: "Collect recyclable materials from your campus and community to promote sustainable waste management.",
    reward: 25,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-21T17:00:00Z",
    progress: "Not Started",
    effortLevel: "Low",
    requiredTime: "2 hours",
    icon: "📚",
    category: "community",
    community: {
      id: "comm_003",
      name: "Student Environmentalists Network",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_013",
    title: "Community Mural Painting",
    description: "Help create a community mural that celebrates local culture and brings art to public spaces.",
    reward: 80,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-24T18:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "6 hours",
    icon: "🎨",
    category: "community",
    community: {
      id: "comm_004",
      name: "Local Arts Collective",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_014",
    title: "Art Workshop Teaching",
    description: "Teach art workshops for children in underserved communities to make creativity accessible to all.",
    reward: 45,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-17T15:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "3 hours",
    icon: "👶",
    category: "community",
    community: {
      id: "comm_004",
      name: "Local Arts Collective",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_015",
    title: "Health Workshop Mission",
    description: "Facilitate health education workshops to promote wellness and preventive care in communities.",
    reward: 75,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-20T16:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "3 hours",
    icon: "🏥",
    category: "community",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_016",
    title: "Community Health Screening",
    description: "Volunteer at free health screening events to provide basic health services to uninsured individuals.",
    reward: 90,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-23T17:00:00Z",
    progress: "Not Started",
    effortLevel: "High",
    requiredTime: "4 hours",
    icon: "❤️",
    category: "community",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_017",
    title: "Garden Maintenance Mission",
    description: "Help maintain community gardens and teach others about sustainable urban agriculture.",
    reward: 40,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-19T16:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "3 hours",
    icon: "🌱",
    category: "community",
    community: {
      id: "comm_006",
      name: "Urban Garden Network",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_018",
    title: "Composting Workshop",
    description: "Teach community members how to compost kitchen waste and reduce organic waste in landfills.",
    reward: 35,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-21T15:00:00Z",
    progress: "Not Started",
    effortLevel: "Low",
    requiredTime: "2 hours",
    icon: "♻️",
    category: "community",
    community: {
      id: "comm_006",
      name: "Urban Garden Network",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_019",
    title: "Solar Panel Installation",
    description: "Help install solar panels on community buildings to promote renewable energy adoption.",
    reward: 120,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-26T17:00:00Z",
    progress: "Not Started",
    effortLevel: "High",
    requiredTime: "8 hours",
    icon: "☀️",
    category: "community",
    community: {
      id: "comm_007",
      name: "Green Tech Innovators",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  },
  {
    id: "mission_020",
    title: "Green Tech Workshop",
    description: "Lead workshops on sustainable technology solutions and renewable energy for community members.",
    reward: 65,
    status: "available",
    proofRequired: true,
    deadline: "2024-03-22T16:00:00Z",
    progress: "Not Started",
    effortLevel: "Medium",
    requiredTime: "3 hours",
    icon: "⚡",
    category: "community",
    community: {
      id: "comm_007",
      name: "Green Tech Innovators",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    }
  }
]; 