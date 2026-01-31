
export const CATEGORIES = [
  'All',
  'Fashion & Lifestyle',
  'Beauty & Skincare',
  'Tech & Gadgets',
  'Fitness & Health',
  'Travel & Adventure',
  'Food & Dining',
  'Gaming & Esports',
  'Finance & EdTech'
];

export const CITIES = [
  'All',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Goa'
];

export const MOCK_BLOG_POSTS = [
  {
    id: 'blog_1',
    slug: 'future-of-creator-economy-india-2025',
    title: 'The Future of India’s Creator Economy in 2025',
    excerpt: 'Deep dive into the emerging trends, micro-influencer dominance, and why brands are shifting budgets from celebrity ads to creator collaborations.',
    content: `
      <p>The landscape of digital influence in India is undergoing a seismic shift. As we approach 2025, the "celebrity" tag is being redefined by those who build genuine communities rather than just massive follower counts.</p>
      <h2>The Rise of Hyper-Local Content</h2>
      <p>Brands are no longer satisfied with broad national reach. The real conversion is happening in Tier 2 and Tier 3 cities where regional language content is king. We are seeing a 40% increase in campaign ROI when brands collaborate with vernacular creators from cities like Indore, Jaipur, and Kochi.</p>
      <h2>AI: The Silent Co-Pilot</h2>
      <p>Tools like Aria at COLLABSET are not just "nice-to-haves" anymore. Creators are using AI to optimize their scripting, while brands use it for high-precision matching. The human element of storytelling remains, but the engineering behind it is now powered by intelligence.</p>
      <blockquote>"Ambition is the fuel, but transparency is the vehicle for long-term creator success in the Indian market." - Divyansh Shukla, CEO of COLLABSET</blockquote>
      <p>For those looking to scale, the message is clear: authenticity isn't a buzzword; it's a metric that brands are finally learning to measure accurately.</p>
    `,
    category: 'Market Trends',
    author: 'Aria Architect',
    date: 'Oct 24, 2024',
    readTime: '6 min read',
    cover: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop'
  },
  {
    id: 'blog_2',
    slug: 'scaling-your-brand-with-micro-influencers',
    title: 'Scaling Your Brand: Why Micro-Influencers are the Hidden Secret',
    excerpt: 'Learn why engagement rates of 10% on micro-accounts outperform 1% on mega-influencers and how to build an army of brand advocates.',
    content: `
      <p>The math is changing. In the early days of influencer marketing, reach was the only metric that mattered. Today, it's all about the depth of trust.</p>
      <h2>The Engagement Paradox</h2>
      <p>When a creator has 500,000 followers, their connection with individual fans naturally dilutes. However, a micro-influencer with 25,000 followers often knows their most active commenters by name. This psychological "closeness" translates directly to higher brand recall.</p>
      <p>At COLLABSET, we've observed that campaigns utilizing 10 micro-influencers consistently yield 3x higher conversion rates compared to a single macro-influencer with the same total reach.</p>
      <ul>
        <li>Higher authenticity scores in regional demographics.</li>
        <li>Better cost-per-acquisition (CPA) metrics.</li>
        <li>More diverse content styles for the same budget.</li>
      </ul>
      <p>Strategy is shifting from "one big splash" to "a thousand ripples."</p>
    `,
    category: 'Brand Growth',
    author: 'Divyansh Shukla',
    date: 'Oct 20, 2024',
    readTime: '4 min read',
    cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop'
  },
  {
    id: 'blog_3',
    slug: 'negotiation-tips-for-creators',
    title: 'Negotiation Mastery: How to Charge What You’re Worth',
    excerpt: 'A comprehensive guide for creators on valuing their deliverables beyond just views. Learn to pitch usage rights, exclusivity, and production value.',
    content: `
      <p>Stop leaving money on the table. Your rate should reflect your production costs, your niche expertise, and the value of your audience—not just your follower count.</p>
      <h2>Deliverables vs. Metrics</h2>
      <p>When pitching to a brand, don't just send a screenshot of your insights. Talk about the *quality* of your assets. High-definition Reels that are "ad-ready" save brands thousands in production costs. That's a value you should be charging for.</p>
      <p>Consider these three layers when setting your price:</p>
      <ol>
        <li><strong>Base Fee:</strong> For the reach and placement.</li>
        <li><strong>Content Fee:</strong> For the creative effort and equipment.</li>
        <li><strong>Usage Fee:</strong> For the right to use your face and video in their paid ads.</li>
      </ol>
      <p>Transparency is your best friend during a deal. Use data to justify your numbers, and never be afraid to walk away from a deal that undervalues your craft.</p>
    `,
    category: 'Creator Success',
    author: 'Divyansh Shukla',
    date: 'Oct 15, 2024',
    readTime: '8 min read',
    cover: 'https://images.unsplash.com/photo-1553484771-371a8467c3ad?w=1200&h=600&fit=crop'
  }
];

export const MOCK_INFLUENCERS: any[] = [
  {
    id: 'inf_1',
    name: 'Rohan Sharma',
    category: 'Tech & Gadgets',
    city: 'Bengaluru',
    pricePerPost: 15000,
    gender: 'Male',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    followers: 125000,
    avgViews: 45000,
    instagramHandle: '@rohan_tech'
  },
  {
    id: 'inf_2',
    name: 'Ananya Kapoor',
    category: 'Fashion & Lifestyle',
    city: 'Mumbai',
    pricePerPost: 25000,
    gender: 'Female',
    age: 23,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    followers: 450000,
    avgViews: 120000,
    instagramHandle: '@ananya_glam'
  },
  {
    id: 'inf_3',
    name: 'Vikram Singh',
    category: 'Fitness & Health',
    city: 'Delhi NCR',
    pricePerPost: 8000,
    gender: 'Male',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    followers: 85000,
    avgViews: 22000,
    instagramHandle: '@vik_fit'
  }
];

export const MOCK_BRANDS: any[] = [
  {
    id: 'brand_1',
    brandName: 'Zomato',
    category: 'Food & Dining',
    budget: 500000,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.png',
    city: 'Gurugram'
  },
  {
    id: 'brand_2',
    brandName: 'Mamaearth',
    category: 'Beauty & Skincare',
    budget: 200000,
    logo: 'https://mamaearth.in/static/media/logo.f78a7c2.png',
    city: 'Delhi'
  }
];
