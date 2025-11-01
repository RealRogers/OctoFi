/**
 * Mock Data for About Us Page
 * 
 * This file contains all static content and data structures for the About Us page.
 * Data is organized by section and prepared for easy migration to API calls in the future.
 * 
 * @module aboutData
 */

import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Bot, 
  Network, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  Users,
  DollarSign,
  Vote,
  Twitter,
  MessageSquare,
  Send,
  type LucideIcon
} from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents a value/principle card with icon and description
 */
export interface ValueCardData {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string; // Optional Tailwind color class for icon accent
}

/**
 * Represents an AI feature card with optional highlights
 */
export interface FeatureCardData {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights?: string[]; // Optional bullet points
}

/**
 * Represents a community metric with trend indicator
 */
export interface CommunityMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

/**
 * Represents a social media platform link
 */
export interface SocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

/**
 * Represents a governance or community feature
 */
export interface CommunityFeature {
  title: string;
  description: string;
  features: string[];
}

// ============================================================================
// About Us Page Data
// ============================================================================

export const aboutData = {
  /**
   * Hero Section Data
   */
  hero: {
    title: "About OctoFi",
    subtitle: "Community-Driven DeFi Platform with Autonomous AI Trading",
    description: "Democratizing financial intelligence through AI-powered portfolio management and decentralized governance. Join thousands of users leveraging cutting-edge technology to optimize their DeFi strategies.",
  },

  /**
   * About Us Section Data
   */
  about: {
    title: "What is OctoFi?",
    content: [
      "OctoFi is a community-driven DeFi platform that has been pioneering decentralized finance since 2020. Built on principles of transparency, decentralization, and innovation, we empower users to take control of their financial future.",
      "Unlike traditional platforms, OctoFi is governed entirely by its community. Every major decision, from feature development to protocol upgrades, is made through transparent governance proposals where token holders have a voice.",
      "Our platform combines the best of DeFi with cutting-edge artificial intelligence, offering features like cash back rewards, yield optimization, and autonomous AI-powered trading that adapts to market conditions in real-time."
    ],
    highlights: [
      "Community-governed since 2020",
      "Open-source and fully transparent",
      "AI-powered trading automation",
      "Multi-chain DeFi support",
      "Cash back rewards program",
      "Advanced yield optimization"
    ]
  },

  /**
   * AI Features Section Data
   * Showcases the capabilities of the autonomous AI trading agent
   */
  aiFeatures: [
    {
      icon: Brain,
      title: "Market Analysis",
      description: "Advanced AI algorithms analyze market trends, sentiment, and on-chain data in real-time to identify opportunities and risks.",
      highlights: [
        "Real-time trend detection",
        "Sentiment analysis from multiple sources",
        "On-chain metrics tracking",
        "Pattern recognition and prediction"
      ]
    },
    {
      icon: TrendingUp,
      title: "Automatic Reallocation",
      description: "Your portfolio automatically rebalances based on market conditions and your configured risk preferences, maximizing returns while managing exposure.",
      highlights: [
        "Dynamic portfolio rebalancing",
        "Risk-adjusted allocation strategies",
        "Gas-optimized execution",
        "Customizable rebalancing thresholds"
      ]
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Configurable risk parameters with automatic stop-loss and take-profit mechanisms protect your investments from extreme volatility.",
      highlights: [
        "Customizable risk tolerance levels",
        "Automatic stop-loss triggers",
        "Volatility monitoring and alerts",
        "Position size management"
      ]
    },
    {
      icon: Bot,
      title: "Autonomous Trading",
      description: "Set your strategy and let the AI agent execute trades 24/7 based on market opportunities, without requiring constant monitoring.",
      highlights: [
        "24/7 market monitoring",
        "Opportunity detection and execution",
        "Automated trade execution",
        "Performance tracking and reporting"
      ]
    }
  ],

  /**
   * Community Section Data
   * Information about governance, rewards, and social engagement
   */
  community: {
    governance: {
      title: "Decentralized Governance",
      description: "Community members participate in decision-making through proposals and voting. Every token holder has a voice in shaping the future of OctoFi.",
      features: [
        "Submit and vote on governance proposals",
        "Transparent decision-making process",
        "Community-driven roadmap and priorities",
        "On-chain voting for maximum transparency"
      ]
    },
    rewards: {
      title: "Community Rewards",
      description: "Active participants earn rewards through airdrops and governance participation. We believe in rewarding those who contribute to the ecosystem.",
      features: [
        "Regular airdrop programs for active users",
        "Governance participation incentives",
        "Early access to new features",
        "Community contribution rewards"
      ]
    },
    /**
     * Social Media Links
     * Note: Some URLs are placeholders and should be updated with real links
     */
    social: [
      {
        platform: "X (Twitter)",
        url: "https://x.com/octofi",
        icon: Twitter,
        description: "Follow for updates on proposals, airdrops, and community initiatives"
      },
      {
        platform: "Discord",
        url: "#", // Placeholder - update with real Discord invite link
        icon: MessageSquare,
        description: "Join discussions, get support, and connect with the community"
      },
      {
        platform: "Telegram",
        url: "#", // Placeholder - update with real Telegram group link
        icon: Send,
        description: "Real-time updates, announcements, and community chat"
      }
    ],
    /**
     * Community Metrics
     * Mock data - should be replaced with real API calls in production
     */
    metrics: [
      {
        label: "Community Members",
        value: "10,000+",
        icon: Users,
        trend: "up" as const
      },
      {
        label: "Total Value Locked",
        value: "$50M+",
        icon: DollarSign,
        trend: "up" as const
      },
      {
        label: "Active Proposals",
        value: "15",
        icon: Vote,
        trend: "neutral" as const
      },
      {
        label: "Successful Trades",
        value: "100K+",
        icon: TrendingUp,
        trend: "up" as const
      }
    ]
  },

  /**
   * Values and Principles Section Data
   * Core values that guide the OctoFi platform
   */
  values: [
    {
      icon: Network,
      title: "Decentralization",
      description: "Built on principles of decentralization with community governance at its core. No central authority controls the platform - power belongs to the community.",
      color: "text-blue-400"
    },
    {
      icon: Sparkles,
      title: "AI Innovation",
      description: "Leveraging cutting-edge AI and machine learning to provide intelligent trading strategies and market insights that were previously only available to institutions.",
      color: "text-purple-400"
    },
    {
      icon: ShieldCheck,
      title: "Security First",
      description: "Audited smart contracts, secure infrastructure, and transparent operations ensure your assets are protected. Security is never an afterthought.",
      color: "text-green-400"
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Every decision is made with the community in mind. User feedback drives our development priorities and feature roadmap. We build what you need.",
      color: "text-pink-400"
    }
  ],

  /**
   * Call to Action Section Data
   */
  cta: {
    title: "Join the OctoFi Community",
    description: "Be part of the future of decentralized finance. Start trading with AI-powered insights today and join a community that's reshaping DeFi.",
    primaryButton: {
      text: "Launch Dashboard",
      link: "/dashboard"
    },
    secondaryButton: {
      text: "Join Community",
      link: "https://x.com/octofi" // Links to X/Twitter
    }
  }
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all AI features
 * Useful for mapping over features in components
 */
export const getAIFeatures = (): FeatureCardData[] => {
  return aboutData.aiFeatures;
};

/**
 * Get all values/principles
 * Useful for mapping over values in components
 */
export const getValues = (): ValueCardData[] => {
  return aboutData.values;
};

/**
 * Get community metrics
 * Prepared for future API integration
 */
export const getCommunityMetrics = (): CommunityMetric[] => {
  return aboutData.community.metrics;
};

/**
 * Get social links
 * Prepared for future configuration management
 */
export const getSocialLinks = (): SocialLink[] => {
  return aboutData.community.social;
};

// ============================================================================
// Export Types for Component Usage
// ============================================================================

export type { LucideIcon };
