import { 
  db, 
  isFirebaseOnline, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc 
} from './firebase';

export const INITIAL_DATA = {
  settings: {
    designerName: "Kreatix",
    title: "YouTube Thumbnail Designer & Creative Strategist",
    heroBadge: "THUMBNAIL STRATEGY + DESIGN",
    heroHeadline: "Thumbnail Strategy That Gets Clicks.",
    heroSubhead: "Strategic thumbnails designed to earn attention, communicate instantly, and turn impressions into views.",
    totalViews: "500M+",
    avgCtr: "18.4%",
    creatorsCount: "50+",
    turnaroundTime: "24-48h",
    razorpayKeyId: "rzp_test_placeholder_key",
    callPrice: "₹1,999",
    contactEmail: "contact@kreatix.design",
    instagramUrl: "https://instagram.com",
    twitterUrl: "https://twitter.com",
    youtubeUrl: "https://youtube.com"
  },

  strategyPlans: [
    {
      id: "plan-starter",
      title: "Starter CTR Audit",
      badge: "⚡ Quick Start",
      duration: "30 Mins",
      price: "₹999",
      amount: 999,
      popular: false,
      tagline: "Immediate packaging diagnostic & quick CTR boost fixes.",
      features: [
        "30-Minute 1-on-1 screen share audit",
        "Analysis of your lowest vs highest CTR videos",
        "2 tailored title & thumbnail framework concepts",
        "Instant Google Meet recording provided"
      ]
    },
    {
      id: "plan-pro",
      title: "Pro Packaging Blueprint",
      badge: "🔥 Most Popular",
      duration: "45 Mins",
      price: "₹1,999",
      amount: 1999,
      popular: true,
      tagline: "The complete visual storytelling overhaul for high growth.",
      features: [
        "45-Minute deep dive channel revamp & audit",
        "5 custom high-converting thumbnail frameworks",
        "Competitor colorway & facial framing playbook",
        "YouTube A/B testing test-matrix for next 5 videos",
        "Instant Meet recording + Notion strategy action plan"
      ]
    },
    {
      id: "plan-vip",
      title: "VIP Scaling Sprint",
      badge: "💎 Ultimate Value",
      duration: "90 Mins",
      price: "₹4,999",
      amount: 4999,
      popular: false,
      tagline: "Complete channel packaging redesign & priority VIP support.",
      features: [
        "90-Minute intensive channel redesign sprint",
        "10 custom viral thumbnail storyboard wireframes",
        "Live thumbnail design breakdown in Photoshop",
        "Priority WhatsApp access for 14 days post-call",
        "Custom brand colorway & typography asset kit"
      ]
    }
  ],

  clients: [
    { id: "c1", name: "KK Create", handle: "@KKCreate", subs: "2.4M Subs", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
    { id: "c2", name: "Mohak Mangal", handle: "@Mohakmangal", subs: "3.8M Subs", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80" },
    { id: "c3", name: "Tech Burner", handle: "@TechBurner", subs: "11.2M Subs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { id: "c4", name: "Finance With Sharan", handle: "@FinanceWithSharan", subs: "2.8M Subs", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    { id: "c5", name: "Gaurav Chaudhary", handle: "@TechnicalGuruji", subs: "23.4M Subs", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80" },
    { id: "c6", name: "Dhruv Rathee", handle: "@DhruvRathee", subs: "25.8M Subs", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" }
  ],

  marqueeRow1: [
    { id: "m1", title: "1 Left in Tokyo Luxury Penthouse", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80" },
    { id: "m2", title: "Is the White House Truly SECURE?", img: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80" },
    { id: "m3", title: "I Escaped 100 Secret Rooms", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80" },
    { id: "m4", title: "Inside Nintendo World After Dark", img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop&q=80" },
    { id: "m5", title: "The $10,000,000 Island Heist", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80" }
  ],
  marqueeRow2: [
    { id: "m6", title: "He Poured Wine on My $50k Proposal", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80" },
    { id: "m7", title: "Sub Zero vs Scorpion: Final Battle", img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80" },
    { id: "m8", title: "We Exposed Drake's Fake Entourage", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80" },
    { id: "m9", title: "Living on Gutter: India's Floating Slum", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80" },
    { id: "m10", title: "Slingshot vs Real Super Mario World", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80" }
  ],
  marqueeRow3: [
    { id: "m11", title: "My Morning Routine in Kyoto Japan", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80" },
    { id: "m12", title: "Minimalist Coding Setup Tour 2026", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" },
    { id: "m13", title: "Worst Mistake in AI Thumbnail Design", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80" },
    { id: "m14", title: "Quiet Luxury Explained: Secret Wealth", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80" },
    { id: "m15", title: "I Spent 24 Hours in Zero Gravity", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80" }
  ],

  works: [
    {
      id: "w1",
      title: "Inside India's Floating Slum (on gutter...)",
      creator: "KK Create",
      handle: "@KKCreate",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      views: "9.5M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
      ctr: "+19.2%",
      description: "Atmospheric human-centric storytelling thumbnail designed for emotional contrast and high click-through retention."
    },
    {
      id: "w2",
      title: "Inside world's most crowded slum |...",
      creator: "KK Create",
      handle: "@KKCreate",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      views: "12M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80",
      ctr: "+22.5%",
      description: "High-angle claustrophobic perspective creating instant intrigue for documentary audience."
    },
    {
      id: "w3",
      title: "Inside India's TALLEST waste dump! (...",
      creator: "KK Create",
      handle: "@KKCreate",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      views: "7.4M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1611288875785-5b89c3eb0d93?w=800&auto=format&fit=crop&q=80",
      ctr: "+17.8%",
      description: "Dramatic mountain scale contrast with solitary human subject."
    },
    {
      id: "w4",
      title: "Inside India's biggest floating city!",
      creator: "KK Create",
      handle: "@KKCreate",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      views: "4.4M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      ctr: "+16.1%",
      description: "Golden hour glow and intense facial reaction composite."
    },
    {
      id: "w5",
      title: "The Crazy Case of Lawrence Bishnoi",
      creator: "Mohak Mangal",
      handle: "@Mohakmangal",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      views: "4.7M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      ctr: "+18.9%",
      description: "High tension true-crime dual portrait composition with verified tweet mockup."
    },
    {
      id: "w6",
      title: "Pookie Maharaj Exposed",
      creator: "Mohak Mangal",
      handle: "@Mohakmangal",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      views: "4.4M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      ctr: "+15.3%",
      description: "Bold parody vs grim reality split face storytelling."
    },
    {
      id: "w7",
      title: "The $10,000 M4 Ultra Apple Studio",
      creator: "Tech Burner",
      handle: "@TechBurner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      views: "6.8M Views",
      category: "Tech",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      ctr: "+21.4%",
      description: "Vibrant neon lighting, floating hardware breakdown and expressive tech host."
    },
    {
      id: "w8",
      title: "I Survived 7 Days in Sahara Desert",
      creator: "Travel Beyond",
      handle: "@TravelBeyond",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      views: "8.2M Views",
      category: "Travel",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
      ctr: "+19.0%",
      description: "Scorching desert mirage colors with extreme survival urgency cues."
    },
    {
      id: "w9",
      title: "Billionaire Brain Hacks: Neuroscientist on Focus",
      creator: "Mindset Talks",
      handle: "@MindsetTalks",
      avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80",
      views: "5.1M Views",
      category: "Podcast/Interviews",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      ctr: "+18.7%",
      description: "High-contrast split screen with neural glow graphic element."
    },
    {
      id: "w10",
      title: "Darkest Secret of YouTube India (104 Cr Scam)",
      creator: "Mohak Mangal",
      handle: "@Mohakmangal",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      views: "6.2M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
      ctr: "+20.1%",
      description: "Investigation thumbnail featuring SEBI court breakdown and emotional reaction framing."
    },
    {
      id: "w11",
      title: "Aasaram Bapu Exposed: Secret Files",
      creator: "Mohak Mangal",
      handle: "@Mohakmangal",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      views: "5.1M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1576767572996-22e3796d11e7?w=800&auto=format&fit=crop&q=80",
      ctr: "+17.4%",
      description: "Mysterious folder reveal visual metaphor with intense contrasting character angles."
    },
    {
      id: "w12",
      title: "Mumbai Local: India's Deadliest Train (51000+ Deaths)",
      creator: "Mohak Mangal",
      handle: "@Mohakmangal",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      views: "9.8M Views",
      category: "Documentary",
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80",
      ctr: "+23.8%",
      description: "Bold red danger counter metric overlay paired with real moving train perspective."
    }
  ],

  beforeAfter: [
    {
      id: "ba1",
      title: "Buried Alive in Sandstorm Escape",
      category: "Challenge / Survival",
      beforeImg: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "ba2",
      title: "$50 to $21,873 Trading Strategy",
      category: "Finance / Crypto",
      beforeImg: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "ba3",
      title: "Subway Train vs Spider-Man Armor",
      category: "Entertainment",
      beforeImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "ba4",
      title: "Midnight Car Chase: Backrooms Monster",
      category: "Horror / Gaming",
      beforeImg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "ba5",
      title: "Flaming Skull Curse Myth Explained",
      category: "Documentary",
      beforeImg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "ba6",
      title: "The Secret Hierarchy of Shadow Wealth",
      category: "Documentary / Secrets",
      beforeImg: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      afterImg: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80"
    }
  ],

  testimonials: [
    {
      id: "t1",
      author: "KK Create",
      channel: "2.4M Subscribers",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      text: "Kreatix literally transformed our YouTube channel's CTR. Our documentary on Mumbai slums jumped from 6% to 18.5% CTR in 48 hours and hit 12 Million views. Absolutely unmatched speed and creative direction!"
    },
    {
      id: "t2",
      author: "Mohak Mangal",
      channel: "3.8M Subscribers",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      text: "The storytelling in each thumbnail is insane. He doesn't just edit images, he understands audience psychology and what makes someone actually stop scrolling and click. 10/10 recommendation."
    },
    {
      id: "t3",
      author: "Tech Burner Studio",
      channel: "11M+ Subscribers",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      text: "Super fast 24h turnaround, crisp high-res 4K renders, and ready-to-test A/B variations every single time. Working with Kreatix has been one of the best investments for our team."
    }
  ],

  faqs: [
    {
      id: "f1",
      question: "What is your typical turnaround time for a thumbnail?",
      answer: "Standard turnaround is 24 to 48 hours. For urgent same-day uploads, priority rush turnaround (under 12 hours) is available upon request."
    },
    {
      id: "f2",
      question: "How many thumbnail concepts and revisions do I get?",
      answer: "Each project includes 2 to 3 distinct concept sketches/wireframes based on your video brief. Once you select your favorite concept, you get unlimited fine-tuning revisions until 100% satisfied."
    },
    {
      id: "f3",
      question: "Do you provide A/B testing variations?",
      answer: "Yes! For major releases, we supply multiple colorways, text variations, and facial crop variations designed specifically for YouTube's Test & Compare A/B feature."
    },
    {
      id: "f4",
      question: "What format and files will I receive?",
      answer: "You receive ultra-crisp 4K and 1080p WebP/PNG formats optimized for YouTube compression (<2MB limit without quality loss), plus editable layered PSD files if requested."
    },
    {
      id: "f5",
      question: "How does the 1-on-1 strategy call work?",
      answer: "During our 45-minute 1-on-1 call, we do a live audit of your YouTube channel's CTR, analyze your top competitors, blueprint a custom thumbnail style guide, and plan your next 5 video packaging concepts."
    }
  ],

  featuredSpotlights: [
    {
      id: "spotlight-1",
      creator: "Kavya Karnatac",
      handle: "@KKCreate",
      subscribers: "2.4M Subscribers",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      niche: "Investigative Documentaries",
      title: "Inside India's TALLEST waste dump! (we were beaten 😢)",
      thumbnail: "https://images.unsplash.com/photo-1611288875785-5b89c3eb0d93?w=1200&auto=format&fit=crop&q=80",
      tag: "Documentary",
      views: "7.0M",
      ctrBoost: "+24.5% CTR",
      rank: "Rank #1 Suggested",
      strategyHeadline: "High-contrast visual tension paired with curiosity-driven facial framing",
      strategyPoints: [
        "Extracted high emotional facial expression with custom color grading to pop on dark mode feeds.",
        "Simplified visual hierarchy to 2 focal points: subject emotion + massive environmental scale.",
        "Resulted in 4.2x higher suggested video impressions within the first 48 hours."
      ]
    },
    {
      id: "spotlight-2",
      creator: "Mohak Mangal",
      handle: "@Mohakmangal",
      subscribers: "3.8M Subscribers",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      niche: "Current Affairs & Deep Dives",
      title: "The Lawrence Bishnoi Crime Network Explained",
      thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
      tag: "True Crime / Analysis",
      views: "4.7M",
      ctrBoost: "+18.4% CTR",
      rank: "Best Launch Q4",
      strategyHeadline: "Dark cinematic lighting with recognizable storytelling iconography",
      strategyPoints: [
        "Custom vector map overlay integrated with dramatic dual-tone lighting to signal geopolitical gravity.",
        "Zero clutter typography: let the visual intrigue do 100% of the conversion work.",
        "Average view duration increased by 2:15m due to strong packaging alignment with intro hook."
      ]
    },
    {
      id: "spotlight-3",
      creator: "Tech Burner",
      handle: "@TechBurner",
      subscribers: "11.2M Subscribers",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      niche: "Tech & Entertainment",
      title: "M4 Ultra Mac Studio vs $10,000 Custom PC Rig",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
      tag: "Tech Review",
      views: "3.8M",
      ctrBoost: "+16.1% CTR",
      rank: "Trending #4 Tech",
      strategyHeadline: "Extreme product contrast & dynamic rim lighting for maximum feed punch",
      strategyPoints: [
        "3D product isolation with neon cyan/magenta backlighting to create maximum depth on mobile screens.",
        "Optimized for 1.5-second feed scan time: immediate visual clarity on 1080p and mobile feeds.",
        "Generated 740K views in the first 24 hours alone, trending #4 in YouTube Tech."
      ]
    }
  ],

  caseStudies: [
    {
      id: "cs-1",
      creator: "Kavya Karnatac",
      subscribers: "2.4M Subscribers",
      niche: "Documentaries",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      chatMessage1: "Aanchal's talent for creating thumbnails is incredible. She just gets the vibe we're going for, often delivering designs that are even better than what we imagined. Since we started working with her, our engagement has visibly improved, especially with the fresh visual style she's brought to our documentary videos. Her thumbnails feel clean, clickable, and grab attention instantly.",
      chatMessage2: "Thanks to her, our content not only looks more professional but also feels more 'us'.",
      chatTime: "11:42 AM • WhatsApp",
      videoTitle: "Inside India's TALLEST waste dump! (we were beaten 😢)",
      videoViews: "7M views",
      videoTimeAgo: "4 months ago",
      videoThumbnail: "https://images.unsplash.com/photo-1611288875785-5b89c3eb0d93?w=800&auto=format&fit=crop&q=80",
      videoDuration: "20:00",
      badgeGreen: "+24.5% CTR Surge",
      badgeBlue: "Rank #1 on Suggested",
      articleTitle: "",
      articleDesc: "",
      articleImage: ""
    },
    {
      id: "cs-2",
      creator: "Mohak Mangal",
      subscribers: "3.8M Subscribers",
      niche: "3.8M Subscribers",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      chatMessage1: "Aanchal has been a reliable asset to my team. She's incredibly creative, growth driven, and constantly pushes boundaries to elevate our work. What sets her apart is her ability to take feedback openly while confidently challenging ideas when needed. Every time I ask for something, she brings logic and a strategic perspective to every decision.",
      chatMessage2: "",
      chatTime: "4:20 PM • WhatsApp",
      videoTitle: "",
      videoViews: "",
      videoTimeAgo: "",
      videoThumbnail: "",
      videoDuration: "",
      badgeGreen: "",
      badgeBlue: "",
      articleTitle: "Mohak Mangal Case Study - How I helped them?",
      articleDesc: "Working with Mohak as my very first client taught me a lot about YouTube packaging strategy and thumbnail design. His trust allowed us to experiment boldly, trying new formats, implementing bold ideas, and pushing creative boundaries.",
      articleImage: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80"
    }
  ],

  bookings: [
    {
      id: "b1",
      creatorName: "Aman Gupta",
      email: "aman@creator.com",
      channelUrl: "https://youtube.com/@amangupta",
      topic: "Documentary CTR audit & 5 video package review",
      preferredDate: "2026-09-15",
      preferredTime: "18:00 IST",
      status: "Scheduled",
      paymentStatus: "Completed",
      amount: "₹1,999",
      createdAt: new Date().toISOString()
    }
  ]
};

const LOCAL_STORAGE_KEY = "aryan_nextjs_portfolio_data_v1";

class NextDataStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  loadLocal() {
    if (typeof window === 'undefined') return this.data;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        this.data = { ...INITIAL_DATA, ...JSON.parse(cached) };
      }
    } catch(e) {}
    return this.data;
  }

  saveLocal() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.data));
      } catch(e) {}
    }
  }

  async syncFirestore() {
    if (!isFirebaseOnline || !db) return;
    try {
      const collectionsToSync = ['works', 'beforeAfter', 'testimonials', 'faqs', 'bookings', 'clients', 'strategyPlans', 'featuredSpotlights', 'caseStudies'];
      for (const colName of collectionsToSync) {
        const q = collection(db, colName);
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const items = [];
          snapshot.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));
          this.data[colName] = items;
        }
      }
      this.saveLocal();
    } catch(e) {
      console.warn("Firestore sync error:", e?.message);
    }
  }

  getSnapshot() {
    return this.loadLocal();
  }

  async addWork(work) {
    const id = "w_" + Date.now();
    const item = { id, ...work };
    this.data.works.unshift(item);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await setDoc(doc(db, "works", id), item); } catch(e) {}
    }
    return item;
  }

  async deleteWork(id) {
    this.data.works = this.data.works.filter(w => w.id !== id);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await deleteDoc(doc(db, "works", id)); } catch(e) {}
    }
  }

  async addBeforeAfter(item) {
    const id = "ba_" + Date.now();
    const newItem = { id, ...item };
    this.data.beforeAfter.unshift(newItem);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await setDoc(doc(db, "beforeAfter", id), newItem); } catch(e) {}
    }
    return newItem;
  }

  async deleteBeforeAfter(id) {
    this.data.beforeAfter = this.data.beforeAfter.filter(b => b.id !== id);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await deleteDoc(doc(db, "beforeAfter", id)); } catch(e) {}
    }
  }

  async addBooking(booking) {
    const id = "book_" + Date.now();
    const item = {
      id,
      ...booking,
      createdAt: new Date().toISOString(),
      status: booking.status || "New",
      paymentStatus: booking.paymentStatus || "Completed"
    };
    this.data.bookings.unshift(item);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await setDoc(doc(db, "bookings", id), item); } catch(e) {}
    }
    return item;
  }

  async updateBookingStatus(id, status, paymentStatus) {
    const index = this.data.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      if (status) this.data.bookings[index].status = status;
      if (paymentStatus) this.data.bookings[index].paymentStatus = paymentStatus;
      this.saveLocal();
      if (isFirebaseOnline && db) {
        try { await setDoc(doc(db, "bookings", id), this.data.bookings[index]); } catch(e) {}
      }
    }
  }

  async updateStrategyPlan(id, updatedFields) {
    if (!this.data.strategyPlans) this.data.strategyPlans = [...INITIAL_DATA.strategyPlans];
    const index = this.data.strategyPlans.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.strategyPlans[index] = { ...this.data.strategyPlans[index], ...updatedFields };
      this.saveLocal();
      if (isFirebaseOnline && db) {
        try { await setDoc(doc(db, "strategyPlans", id), this.data.strategyPlans[index]); } catch(e) {}
      }
    }
  }

  async updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await setDoc(doc(db, "settings", "global"), this.data.settings); } catch(e) {}
    }
  }

  // --- Featured Spotlights CRUD ---
  async addFeaturedSpotlight(spotlight) {
    if (!this.data.featuredSpotlights) this.data.featuredSpotlights = [...INITIAL_DATA.featuredSpotlights];
    const id = "spotlight_" + Date.now();
    const newItem = { id, ...spotlight };
    this.data.featuredSpotlights.push(newItem);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await setDoc(doc(db, "featuredSpotlights", id), newItem); } catch(e) {}
    }
    return newItem;
  }

  async updateFeaturedSpotlight(id, updatedFields) {
    if (!this.data.featuredSpotlights) this.data.featuredSpotlights = [...INITIAL_DATA.featuredSpotlights];
    const index = this.data.featuredSpotlights.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.featuredSpotlights[index] = { ...this.data.featuredSpotlights[index], ...updatedFields };
      this.saveLocal();
      if (isFirebaseOnline && db) {
        try { await setDoc(doc(db, "featuredSpotlights", id), this.data.featuredSpotlights[index]); } catch(e) {}
      }
    }
  }

  async deleteFeaturedSpotlight(id) {
    if (!this.data.featuredSpotlights) this.data.featuredSpotlights = [...INITIAL_DATA.featuredSpotlights];
    this.data.featuredSpotlights = this.data.featuredSpotlights.filter(s => s.id !== id);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await deleteDoc(doc(db, "featuredSpotlights", id)); } catch(e) {}
    }
  }

  // --- Case Studies CRUD ---
  async addCaseStudy(caseStudy) {
    if (!this.data.caseStudies) this.data.caseStudies = [...INITIAL_DATA.caseStudies];
    const id = "cs_" + Date.now();
    const newItem = { id, ...caseStudy };
    this.data.caseStudies.push(newItem);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await setDoc(doc(db, "caseStudies", id), newItem); } catch(e) {}
    }
    return newItem;
  }

  async updateCaseStudy(id, updatedFields) {
    if (!this.data.caseStudies) this.data.caseStudies = [...INITIAL_DATA.caseStudies];
    const index = this.data.caseStudies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.caseStudies[index] = { ...this.data.caseStudies[index], ...updatedFields };
      this.saveLocal();
      if (isFirebaseOnline && db) {
        try { await setDoc(doc(db, "caseStudies", id), this.data.caseStudies[index]); } catch(e) {}
      }
    }
  }

  async deleteCaseStudy(id) {
    if (!this.data.caseStudies) this.data.caseStudies = [...INITIAL_DATA.caseStudies];
    this.data.caseStudies = this.data.caseStudies.filter(c => c.id !== id);
    this.saveLocal();
    if (isFirebaseOnline && db) {
      try { await deleteDoc(doc(db, "caseStudies", id)); } catch(e) {}
    }
  }
}

export const nextStore = new NextDataStore();
