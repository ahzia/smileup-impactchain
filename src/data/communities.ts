export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  banner: string;
  members: number;
  missions: number;
  totalSmiles: number;
  status: "active" | "featured";
  createdBy: string;
  createdAt: string;
  location: string;
  website: string;
  recentPosts: {
    id: string;
    title: string;
    mediaUrl: string;
    createdAt: string;
  }[];
  recentMissions: {
    id: string;
    title: string;
    reward: number;
    status: string;
  }[];
}

export const communities: Community[] = [
  {
    id: "comm_001",
    name: "Green Earth Initiative",
    description: "A leading environmental organization dedicated to protecting our planet through community action, education, and sustainable practices. We focus on local environmental challenges and global climate solutions.",
    category: "sustainability",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=300&fit=crop",
    members: 1250,
    missions: 45,
    totalSmiles: 25000,
    status: "featured",
    createdBy: "user_001",
    createdAt: "2023-08-15T09:00:00Z",
    location: "San Francisco, CA",
    website: "https://greenearthinitiative.org",
    recentPosts: [
      {
        id: "post_001",
        title: "Beach Cleanup Success - 500kg of waste collected!",
        mediaUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
        createdAt: "2024-03-15T10:30:00Z"
      },
      {
        id: "post_002",
        title: "Tree Planting Workshop - Join us this weekend",
        mediaUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
        createdAt: "2024-03-12T14:20:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_001", title: "Beach Cleanup Mission", reward: 50, status: "active" },
      { id: "mission_002", title: "Tree Planting Challenge", reward: 75, status: "active" }
    ]
  },
  {
    id: "comm_002",
    name: "Tech for Social Impact",
    description: "Empowering communities through technology innovation. We connect tech professionals with social causes, providing digital solutions for nonprofits and community organizations.",
    category: "technology",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop",
    members: 890,
    missions: 32,
    totalSmiles: 18000,
    status: "active",
    createdBy: "user_002",
    createdAt: "2023-09-20T11:15:00Z",
    location: "Austin, TX",
    website: "https://techforsocialimpact.org",
    recentPosts: [
      {
        id: "post_003",
        title: "Hackathon Results - 15 new apps for nonprofits",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-14T16:45:00Z"
      },
      {
        id: "post_004",
        title: "Digital Literacy Workshop - Free coding classes",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-10T09:30:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_003", title: "Code for Good Hackathon", reward: 100, status: "active" },
      { id: "mission_004", title: "Digital Literacy Teaching", reward: 60, status: "active" }
    ]
  },
  {
    id: "comm_003",
    name: "Student Environmentalists Network",
    description: "A nationwide network of student activists working together to address environmental challenges on campuses and in local communities. Empowering the next generation of environmental leaders.",
    category: "education",
    logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=800&h=300&fit=crop",
    members: 2100,
    missions: 78,
    totalSmiles: 35000,
    status: "featured",
    createdBy: "user_004",
    createdAt: "2023-07-10T08:30:00Z",
    location: "Multiple Campuses",
    website: "https://studentenvironmentalists.org",
    recentPosts: [
      {
        id: "post_005",
        title: "Campus Sustainability Challenge - Results",
        mediaUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=400&h=300&fit=crop",
        createdAt: "2024-03-13T12:15:00Z"
      },
      {
        id: "post_006",
        title: "Recycling Drive Success - 2 tons collected",
        mediaUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=400&h=300&fit=crop",
        createdAt: "2024-03-08T15:20:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_005", title: "Campus Cleanup Mission", reward: 30, status: "active" },
      { id: "mission_006", title: "Recycling Drive Challenge", reward: 25, status: "active" }
    ]
  },
  {
    id: "comm_004",
    name: "Local Arts Collective",
    description: "Supporting local artists and cultural initiatives. We organize community art events, workshops, and exhibitions to celebrate diversity and creativity in our neighborhoods.",
    category: "culture",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop",
    members: 650,
    missions: 28,
    totalSmiles: 12000,
    status: "active",
    createdBy: "user_005",
    createdAt: "2023-10-05T13:45:00Z",
    location: "Brooklyn, NY",
    website: "https://localartscollective.org",
    recentPosts: [
      {
        id: "post_007",
        title: "Community Mural Project - Final Reveal",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-11T18:00:00Z"
      },
      {
        id: "post_008",
        title: "Art Workshop for Kids - This Saturday",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-09T10:15:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_007", title: "Community Mural Painting", reward: 80, status: "active" },
      { id: "mission_008", title: "Art Workshop Teaching", reward: 45, status: "active" }
    ]
  },
  {
    id: "comm_005",
    name: "Community Health Advocates",
    description: "Promoting health and wellness in underserved communities. We provide health education, organize wellness programs, and connect people with healthcare resources.",
    category: "health",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=300&fit=crop",
    members: 980,
    missions: 41,
    totalSmiles: 22000,
    status: "active",
    createdBy: "user_003",
    createdAt: "2023-11-12T10:20:00Z",
    location: "Los Angeles, CA",
    website: "https://communityhealthadvocates.org",
    recentPosts: [
      {
        id: "post_009",
        title: "Mental Health Awareness Workshop - Success",
        mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        createdAt: "2024-03-14T14:30:00Z"
      },
      {
        id: "post_010",
        title: "Free Health Screening - This Weekend",
        mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        createdAt: "2024-03-12T11:45:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_009", title: "Health Workshop Mission", reward: 75, status: "active" },
      { id: "mission_010", title: "Community Health Screening", reward: 90, status: "active" }
    ]
  },
  {
    id: "comm_006",
    name: "Urban Garden Network",
    description: "Transforming urban spaces into green oases. We help communities create and maintain gardens, promote sustainable urban agriculture, and build food security.",
    category: "sustainability",
    logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=300&fit=crop",
    members: 750,
    missions: 35,
    totalSmiles: 15000,
    status: "active",
    createdBy: "user_001",
    createdAt: "2023-12-01T09:15:00Z",
    location: "Chicago, IL",
    website: "https://urbangardennetwork.org",
    recentPosts: [
      {
        id: "post_011",
        title: "Community Garden Harvest - 500lbs of vegetables",
        mediaUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
        createdAt: "2024-03-13T16:20:00Z"
      },
      {
        id: "post_012",
        title: "Garden Workshop - Composting Basics",
        mediaUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
        createdAt: "2024-03-10T13:00:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_011", title: "Garden Maintenance Mission", reward: 40, status: "active" },
      { id: "mission_012", title: "Composting Workshop", reward: 35, status: "active" }
    ]
  },
  {
    id: "comm_007",
    name: "Green Tech Innovators",
    description: "Advancing sustainable technology solutions. We bring together engineers, designers, and entrepreneurs to develop innovative solutions for environmental challenges.",
    category: "technology",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop",
    members: 420,
    missions: 22,
    totalSmiles: 9500,
    status: "active",
    createdBy: "user_001",
    createdAt: "2024-01-20T14:30:00Z",
    location: "Seattle, WA",
    website: "https://greentechinnovators.org",
    recentPosts: [
      {
        id: "post_013",
        title: "Solar Panel Installation Project - Complete",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-12T17:45:00Z"
      },
      {
        id: "post_014",
        title: "Green Tech Startup Pitch Event",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-09T19:30:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_013", title: "Solar Panel Installation", reward: 120, status: "active" },
      { id: "mission_014", title: "Green Tech Workshop", reward: 65, status: "active" }
    ]
  },
  {
    id: "comm_008",
    name: "Mental Health Awareness",
    description: "Breaking the stigma around mental health. We provide education, support groups, and resources to help communities understand and address mental health challenges.",
    category: "health",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=300&fit=crop",
    members: 1100,
    missions: 38,
    totalSmiles: 28000,
    status: "featured",
    createdBy: "user_003",
    createdAt: "2024-02-10T11:00:00Z",
    location: "Boston, MA",
    website: "https://mentalhealthawareness.org",
    recentPosts: [
      {
        id: "post_015",
        title: "Mental Health First Aid Training - Success",
        mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        createdAt: "2024-03-15T15:20:00Z"
      },
      {
        id: "post_016",
        title: "Support Group Launch - New Location",
        mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        createdAt: "2024-03-11T12:30:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_015", title: "Mental Health Workshop", reward: 85, status: "active" },
      { id: "mission_016", title: "Support Group Facilitation", reward: 70, status: "active" }
    ]
  },
  {
    id: "comm_009",
    name: "Local Arts Collective",
    description: "Celebrating local artists and cultural diversity. We organize art exhibitions, workshops, and cultural events to bring communities together through creativity.",
    category: "culture",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop",
    members: 580,
    missions: 25,
    totalSmiles: 11000,
    status: "active",
    createdBy: "user_005",
    createdAt: "2024-01-15T16:45:00Z",
    location: "Portland, OR",
    website: "https://localartscollective.org",
    recentPosts: [
      {
        id: "post_017",
        title: "Cultural Festival - Huge Success",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-14T20:15:00Z"
      },
      {
        id: "post_018",
        title: "Art Workshop for Seniors - New Program",
        mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        createdAt: "2024-03-10T14:00:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_017", title: "Cultural Workshop Mission", reward: 60, status: "active" },
      { id: "mission_018", title: "Art for All Program", reward: 50, status: "active" }
    ]
  },
  {
    id: "comm_010",
    name: "Digital Learning Hub",
    description: "Bridging the digital divide through education. We provide free computer classes, coding workshops, and digital literacy programs for all ages.",
    category: "education",
    logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=800&h=300&fit=crop",
    members: 720,
    missions: 31,
    totalSmiles: 14000,
    status: "active",
    createdBy: "user_007",
    createdAt: "2024-02-05T10:30:00Z",
    location: "Miami, FL",
    website: "https://digitallearninghub.org",
    recentPosts: [
      {
        id: "post_019",
        title: "Coding Bootcamp Graduation - 25 new developers",
        mediaUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=400&h=300&fit=crop",
        createdAt: "2024-03-13T18:30:00Z"
      },
      {
        id: "post_020",
        title: "Senior Tech Workshop - Great turnout",
        mediaUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=400&h=300&fit=crop",
        createdAt: "2024-03-09T15:45:00Z"
      }
    ],
    recentMissions: [
      { id: "mission_019", title: "Teaching Workshop Mission", reward: 55, status: "active" },
      { id: "mission_020", title: "Student Mentoring Program", reward: 45, status: "active" }
    ]
  }
]; 