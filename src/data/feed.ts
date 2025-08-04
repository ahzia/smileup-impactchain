export interface FeedPost {
  id: string;
  mediaType: "video" | "image" | "text";
  mediaUrl?: string;
  title: string;
  description: string;
  community: {
    id: string;
    name: string;
    logo: string;
  };
  challenge: string;
  callToAction: string[];
  links: string[];
  smiles: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
}

export const feedPosts: FeedPost[] = [
  {
    id: "post_001",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Beach Cleanup Success - 500kg of waste collected!",
    description: "Our amazing volunteers spent the weekend cleaning up the local beach. We collected over 500kg of plastic waste and marine debris. This is what community action looks like! 🌊♻️",
    community: {
      id: "comm_001",
      name: "Green Earth Initiative",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    },
    challenge: "Marine pollution is threatening our oceans. Every piece of plastic we remove makes a difference.",
    callToAction: ["Join our next cleanup", "Donate to support our work", "Learn about marine conservation"],
    links: ["https://greenearthinitiative.org/cleanup", "https://greenearthinitiative.org/donate"],
    smiles: 1250,
    commentsCount: 45,
    likesCount: 320,
    createdAt: "2024-03-15T10:30:00Z"
  },
  {
    id: "post_002",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=600&fit=crop",
    title: "Tree Planting Workshop - Join us this weekend",
    description: "We're planting 100 native trees this weekend to restore our local ecosystem. Learn about native species and get your hands dirty! 🌳🌱",
    community: {
      id: "comm_001",
      name: "Green Earth Initiative",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    },
    challenge: "Urban areas are losing green spaces. We need to restore native habitats for wildlife and clean air.",
    callToAction: ["Register for the workshop", "Donate trees", "Volunteer for future plantings"],
    links: ["https://greenearthinitiative.org/tree-planting", "https://greenearthinitiative.org/donate"],
    smiles: 890,
    commentsCount: 32,
    likesCount: 245,
    createdAt: "2024-03-12T14:20:00Z"
  },
  {
    id: "post_003",
    mediaType: "video",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Hackathon Results - 15 new apps for nonprofits",
    description: "Our 48-hour hackathon brought together 50 developers who created 15 innovative apps for local nonprofits. Technology for social good! 💻❤️",
    community: {
      id: "comm_002",
      name: "Tech for Social Impact",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    },
    challenge: "Nonprofits often lack the resources for custom software solutions. We're bridging that gap.",
    callToAction: ["Join our next hackathon", "Volunteer your tech skills", "Support our programs"],
    links: ["https://techforsocialimpact.org/hackathon", "https://techforsocialimpact.org/volunteer"],
    smiles: 2100,
    commentsCount: 67,
    likesCount: 445,
    createdAt: "2024-03-14T16:45:00Z"
  },
  {
    id: "post_004",
    mediaType: "text",
    title: "Mental Health Awareness Campaign",
    description: "Breaking the stigma around mental health. Join our community in creating safe spaces for open dialogue and support. Every conversation matters. 💚🧠",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    },
    challenge: "Mental health stigma prevents people from seeking help. We're creating safe spaces for open dialogue.",
    callToAction: ["Join our support groups", "Volunteer as a facilitator", "Donate to our programs"],
    links: ["https://communityhealthadvocates.org/support", "https://communityhealthadvocates.org/volunteer"],
    smiles: 1650,
    commentsCount: 78,
    likesCount: 432,
    createdAt: "2024-03-14T14:30:00Z"
  },
  {
    id: "post_005",
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=400&h=600&fit=crop",
    title: "Campus Sustainability Challenge - Results",
    description: "Students from 25 campuses competed to reduce their carbon footprint. The results are incredible! 🎓🌱",
    community: {
      id: "comm_003",
      name: "Student Environmentalists Network",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    },
    challenge: "Universities are major contributors to climate change. Students are leading the way to sustainable campuses.",
    callToAction: ["Join your campus chapter", "Start a sustainability club", "Learn about campus initiatives"],
    links: ["https://studentenvironmentalists.org/chapters", "https://studentenvironmentalists.org/start"],
    smiles: 1800,
    commentsCount: 89,
    likesCount: 567,
    createdAt: "2024-03-13T12:15:00Z"
  },
  {
    id: "post_006",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=400&h=600&fit=crop",
    title: "Recycling Drive Success - 2 tons collected",
    description: "Students collected over 2 tons of recyclable materials in our campus-wide recycling drive. Every bottle counts! ♻️📚",
    community: {
      id: "comm_003",
      name: "Student Environmentalists Network",
      logo: "https://images.unsplash.com/photo-1523240798132-8757214e6b0a?w=100&h=100&fit=crop"
    },
    challenge: "Campus waste management is often inefficient. Students are creating sustainable solutions.",
    callToAction: ["Join the recycling team", "Start a drive at your school", "Learn about waste reduction"],
    links: ["https://studentenvironmentalists.org/recycling", "https://studentenvironmentalists.org/start"],
    smiles: 650,
    commentsCount: 34,
    likesCount: 234,
    createdAt: "2024-03-08T15:20:00Z"
  },
  {
    id: "post_007",
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    title: "Community Mural Project - Final Reveal",
    description: "After 3 months of work, our community mural is complete! 50 artists, 200 volunteers, one beautiful story. 🎨✨",
    community: {
      id: "comm_004",
      name: "Local Arts Collective",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    },
    challenge: "Public spaces often lack cultural representation. We're bringing community stories to life through art.",
    callToAction: ["Visit the mural", "Join our next project", "Support local artists"],
    links: ["https://localartscollective.org/mural", "https://localartscollective.org/projects"],
    smiles: 1200,
    commentsCount: 56,
    likesCount: 378,
    createdAt: "2024-03-11T18:00:00Z"
  },
  {
    id: "post_008",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    title: "Art Workshop for Kids - This Saturday",
    description: "Free art workshops for children in underserved communities. Creativity has no boundaries! 🎨👶",
    community: {
      id: "comm_004",
      name: "Local Arts Collective",
      logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop"
    },
    challenge: "Arts education is often inaccessible to low-income families. We're making creativity available to all children.",
    callToAction: ["Register your child", "Volunteer to teach", "Donate art supplies"],
    links: ["https://localartscollective.org/workshops", "https://localartscollective.org/volunteer"],
    smiles: 450,
    commentsCount: 23,
    likesCount: 156,
    createdAt: "2024-03-09T10:15:00Z"
  },
  {
    id: "post_009",
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop",
    title: "Mental Health Awareness Workshop - Success",
    description: "Over 200 people attended our mental health workshop. Breaking the stigma, one conversation at a time. 💚🧠",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    },
    challenge: "Mental health stigma prevents people from seeking help. We're creating safe spaces for open dialogue.",
    callToAction: ["Join our support groups", "Volunteer as a facilitator", "Donate to our programs"],
    links: ["https://communityhealthadvocates.org/support", "https://communityhealthadvocates.org/volunteer"],
    smiles: 1650,
    commentsCount: 78,
    likesCount: 432,
    createdAt: "2024-03-14T14:30:00Z"
  },
  {
    id: "post_010",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop",
    title: "Free Health Screening - This Weekend",
    description: "Free health screenings for uninsured individuals. Your health matters, regardless of your insurance status. 🏥❤️",
    community: {
      id: "comm_005",
      name: "Community Health Advocates",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"
    },
    challenge: "Healthcare access is a major issue in underserved communities. We're providing basic health services for free.",
    callToAction: ["Register for screening", "Volunteer as a healthcare worker", "Donate medical supplies"],
    links: ["https://communityhealthadvocates.org/screening", "https://communityhealthadvocates.org/volunteer"],
    smiles: 980,
    commentsCount: 45,
    likesCount: 267,
    createdAt: "2024-03-12T11:45:00Z"
  },
  {
    id: "post_011",
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop",
    title: "Community Garden Harvest - 500lbs of vegetables",
    description: "Our community garden produced 500lbs of fresh vegetables this season! Food security starts in our neighborhoods. 🥬🌽",
    community: {
      id: "comm_006",
      name: "Urban Garden Network",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop"
    },
    challenge: "Food deserts leave communities without access to fresh produce. We're growing food where people live.",
    callToAction: ["Join a community garden", "Start your own garden", "Donate gardening supplies"],
    links: ["https://urbangardennetwork.org/gardens", "https://urbangardennetwork.org/start"],
    smiles: 1100,
    commentsCount: 52,
    likesCount: 345,
    createdAt: "2024-03-13T16:20:00Z"
  },
  {
    id: "post_012",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=600&fit=crop",
    title: "Garden Workshop - Composting Basics",
    description: "Teaching community members how to turn kitchen waste into garden gold. Composting is easier than you think! 🌱♻️",
    community: {
      id: "comm_006",
      name: "Urban Garden Network",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop"
    },
    challenge: "Organic waste in landfills produces methane. Composting reduces waste and creates nutrient-rich soil.",
    callToAction: ["Join our composting workshop", "Start composting at home", "Volunteer in gardens"],
    links: ["https://urbangardennetwork.org/workshops", "https://urbangardennetwork.org/composting"],
    smiles: 650,
    commentsCount: 31,
    likesCount: 198,
    createdAt: "2024-03-10T13:00:00Z"
  }
]; 