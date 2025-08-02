export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  smiles: number;
  level: number;
  score: number;
  bio: string;
  interests: string[];
  friends: number;
  communitiesJoined: string[];
  communitiesCreated: string[];
  badges: string[];
  recentActivities: {
    activity: string;
    time: string;
  }[];
  createdAt: string;
}

export const users: User[] = [
  {
    id: "user_001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    smiles: 1250,
    level: 8,
    score: 3200,
    bio: "Environmental activist and community organizer. Passionate about sustainable living and youth empowerment.",
    interests: ["Sustainability", "Community Service", "Photography", "Hiking"],
    friends: 45,
    communitiesJoined: ["comm_001", "comm_003", "comm_005"],
    communitiesCreated: ["comm_007"],
    badges: ["Early Adopter", "Community Leader", "Eco Warrior", "Mission Master"],
    recentActivities: [
      { activity: "Completed 'Beach Cleanup Mission'", time: "2 hours ago" },
      { activity: "Earned 50 Smiles from 'Tree Planting'", time: "Yesterday" },
      { activity: "Joined 'Green Tech Innovators' community", time: "3 days ago" }
    ],
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "user_002",
    name: "Marcus Johnson",
    email: "marcus.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    smiles: 850,
    level: 6,
    score: 2100,
    bio: "Tech enthusiast and digital nomad. Building solutions for a better tomorrow.",
    interests: ["Technology", "Digital Innovation", "Travel", "Coding"],
    friends: 32,
    communitiesJoined: ["comm_002", "comm_004"],
    communitiesCreated: [],
    badges: ["Tech Innovator", "Digital Nomad", "Mission Master"],
    recentActivities: [
      { activity: "Completed 'Code for Good' mission", time: "1 hour ago" },
      { activity: "Donated 100 Smiles to 'Digital Literacy'", time: "Yesterday" },
      { activity: "Earned 30 Smiles from 'AI Workshop'", time: "2 days ago" }
    ],
    createdAt: "2024-02-01T14:20:00Z"
  },
  {
    id: "user_003",
    name: "Aisha Patel",
    email: "aisha.patel@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    smiles: 2100,
    level: 12,
    score: 4800,
    bio: "Healthcare professional and community health advocate. Making healthcare accessible to all.",
    interests: ["Healthcare", "Community Health", "Yoga", "Meditation"],
    friends: 67,
    communitiesJoined: ["comm_005", "comm_006"],
    communitiesCreated: ["comm_008"],
    badges: ["Health Champion", "Community Leader", "Mission Master", "Top Contributor"],
    recentActivities: [
      { activity: "Created 'Mental Health Awareness' community", time: "5 hours ago" },
      { activity: "Completed 'Health Workshop' mission", time: "Yesterday" },
      { activity: "Earned 75 Smiles from 'Community Health'", time: "3 days ago" }
    ],
    createdAt: "2023-11-20T09:15:00Z"
  },
  {
    id: "user_004",
    name: "David Rodriguez",
    email: "david.rodriguez@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    smiles: 650,
    level: 4,
    score: 1200,
    bio: "Student and environmental advocate. Learning and growing while making a difference.",
    interests: ["Education", "Environment", "Student Life", "Activism"],
    friends: 28,
    communitiesJoined: ["comm_001", "comm_003"],
    communitiesCreated: [],
    badges: ["Student Activist", "Eco Warrior"],
    recentActivities: [
      { activity: "Joined 'Student Environmentalists' community", time: "1 day ago" },
      { activity: "Completed 'Campus Cleanup' mission", time: "2 days ago" },
      { activity: "Earned 25 Smiles from 'Recycling Drive'", time: "1 week ago" }
    ],
    createdAt: "2024-03-10T16:45:00Z"
  },
  {
    id: "user_005",
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    smiles: 1800,
    level: 10,
    score: 3900,
    bio: "Creative director and cultural advocate. Using art and culture to bring communities together.",
    interests: ["Arts", "Culture", "Community Events", "Photography"],
    friends: 53,
    communitiesJoined: ["comm_004", "comm_006"],
    communitiesCreated: ["comm_009"],
    badges: ["Cultural Ambassador", "Community Leader", "Creative Innovator"],
    recentActivities: [
      { activity: "Created 'Local Arts Collective' community", time: "3 hours ago" },
      { activity: "Completed 'Cultural Workshop' mission", time: "Yesterday" },
      { activity: "Earned 60 Smiles from 'Art for All'", time: "2 days ago" }
    ],
    createdAt: "2023-12-05T11:30:00Z"
  },
  {
    id: "user_006",
    name: "James Wilson",
    email: "james.wilson@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    smiles: 950,
    level: 7,
    score: 2400,
    bio: "Business consultant and social entrepreneur. Building sustainable business models.",
    interests: ["Business", "Social Enterprise", "Sustainability", "Mentoring"],
    friends: 41,
    communitiesJoined: ["comm_002", "comm_007"],
    communitiesCreated: [],
    badges: ["Social Entrepreneur", "Business Mentor", "Mission Master"],
    recentActivities: [
      { activity: "Completed 'Business Mentorship' mission", time: "4 hours ago" },
      { activity: "Donated 150 Smiles to 'Youth Entrepreneurship'", time: "Yesterday" },
      { activity: "Earned 40 Smiles from 'Sustainable Business'", time: "3 days ago" }
    ],
    createdAt: "2024-01-25T13:20:00Z"
  },
  {
    id: "user_007",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    smiles: 1400,
    level: 9,
    score: 3100,
    bio: "Teacher and education advocate. Empowering students through innovative learning.",
    interests: ["Education", "Teaching", "Innovation", "Student Development"],
    friends: 38,
    communitiesJoined: ["comm_003", "comm_008"],
    communitiesCreated: ["comm_010"],
    badges: ["Education Champion", "Innovation Leader", "Community Builder"],
    recentActivities: [
      { activity: "Created 'Digital Learning Hub' community", time: "6 hours ago" },
      { activity: "Completed 'Teaching Workshop' mission", time: "Yesterday" },
      { activity: "Earned 55 Smiles from 'Student Mentoring'", time: "2 days ago" }
    ],
    createdAt: "2024-02-15T08:45:00Z"
  },
  {
    id: "user_008",
    name: "Alex Kim",
    email: "alex.kim@email.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    smiles: 750,
    level: 5,
    score: 1600,
    bio: "Software developer and open source contributor. Building technology for social good.",
    interests: ["Technology", "Open Source", "Social Impact", "Coding"],
    friends: 25,
    communitiesJoined: ["comm_002", "comm_004"],
    communitiesCreated: [],
    badges: ["Tech Innovator", "Open Source Contributor"],
    recentActivities: [
      { activity: "Completed 'Code for Good' mission", time: "2 hours ago" },
      { activity: "Joined 'Tech for Social Impact' community", time: "1 day ago" },
      { activity: "Earned 35 Smiles from 'Hackathon'", time: "3 days ago" }
    ],
    createdAt: "2024-03-01T10:15:00Z"
  }
];

export const currentUser: User = users[0]; // Sarah Chen as default current user 