import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedPost } from '@/lib/types';

interface FeedResponse {
  posts: FeedPost[];
  nextCursor?: string;
  hasMore: boolean;
}

// Mock data for development
const mockPosts: FeedPost[] = [
  {
    id: '1',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Ocean Cleanup Initiative',
    description: 'Join us in cleaning up our oceans! This community-led initiative has already removed 10,000 kg of plastic from our beaches.',
    community: {
      id: '1',
      name: 'Ocean Guardians',
      logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center'
    },
    challenge: 'Beach Cleanup',
    callToAction: ['Join the cleanup', 'Donate to the cause'],
    links: ['https://example.com/cleanup'],
    smiles: 1250,
    commentsCount: 89,
    likesCount: 1250,
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    title: 'Tree Planting Campaign',
    description: 'We planted 1,000 trees this month! Help us reach our goal of 10,000 trees by the end of the year.',
    community: {
      id: '2',
      name: 'Green Earth',
      logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center'
    },
    challenge: 'Plant a Tree',
    callToAction: ['Plant with us', 'Support the campaign'],
    links: ['https://example.com/plant'],
    smiles: 890,
    commentsCount: 45,
    likesCount: 890,
    createdAt: '4 hours ago'
  },
  {
    id: '3',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    title: 'Community Garden Project',
    description: 'Our community garden is thriving! Fresh vegetables for everyone and a beautiful space for neighbors to connect.',
    community: {
      id: '3',
      name: 'Urban Farmers',
      logo: 'https://images.unsplash.com/photo-1574943320219-553eb213f72f?w=100&h=100&fit=crop&crop=center'
    },
    challenge: 'Grow Together',
    callToAction: ['Join the garden', 'Learn gardening'],
    links: ['https://example.com/garden'],
    smiles: 567,
    commentsCount: 23,
    likesCount: 567,
    createdAt: '1 day ago'
  }
];

const fetchFeed = async (cursor?: string): Promise<FeedResponse> => {
  try {
    const params = new URLSearchParams();
    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`/api/feed?${params.toString()}`);

    if (!response.ok) {
      throw new Error('API not available');
    }

    const data = await response.json();
    
    // Transform API response to match our expected format
    if (data.success && data.data) {
      return {
        posts: data.data,
        nextCursor: undefined, // For now, we'll implement pagination later
        hasMore: false
      };
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching feed:', error);
    // Fallback to mock data
    console.log('Using mock data for feed');
    return {
      posts: mockPosts,
      nextCursor: undefined,
      hasMore: false
    };
  }
};

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
} 