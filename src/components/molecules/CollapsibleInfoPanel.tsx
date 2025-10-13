/**
 * CollapsibleInfoPanel Component
 * Collapsible accordion for agent information that doesn't take up permanent space
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info, Bot, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CollapsibleInfoPanelProps {
  className?: string;
  defaultExpanded?: boolean;
  position?: 'bottom' | 'sidebar';
}

const CollapsibleInfoPanel: React.FC<CollapsibleInfoPanelProps> = ({
  className,
  defaultExpanded = false,
  position = 'bottom'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const infoSections = [
    {
      id: 'features',
      title: 'Key Features',
      icon: Bot,
      color: 'text-blue-400',
      items: [
        'Real-time market analysis',
        'Risk-based decision making', 
        'Automatic stop-loss & take-profit',
        'Portfolio rebalancing',
        'Multi-timeframe analysis',
        'Sentiment analysis integration'
      ]
    },
    {
      id: 'safety',
      title: 'Safety Measures',
      icon: Shield,
      color: 'text-green-400',
      items: [
        'Configurable risk limits',
        'Cooldown periods',
        'Volatility monitoring',
        'Manual override controls',
        'Position size limits',
        'Emergency stop functionality'
      ]
    },
    {
      id: 'performance',
      title: 'Performance Tracking',
      icon: Activity,
      color: 'text-purple-400',
      items: [
        'Real-time P&L tracking',
        'Win rate monitoring',
        'Sharpe ratio calculation',
        'Drawdown analysis',
        'Benchmark comparisons',
        'Historical performance data'
      ]
    }
  ];

  return (
    <div className={cn('w-full', className)}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        onClick={toggleExpanded}
        className={cn(
          "w-full justify-between p-4 h-auto glass-card-hover transition-all duration-200",
          position === 'sidebar' ? 'text-left' : 'text-center',
          isExpanded ? 'rounded-b-none' : 'rounded-lg'
        )}
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">
            About Your AI Trading Agent
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </Button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            className="overflow-hidden"
          >
            <Card className="glass-card border-t-0 rounded-t-none">
              <CardContent className="p-4 pt-0">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Your AI trading agent uses advanced machine learning algorithms to analyze market conditions, 
                      predict price movements, and execute trades automatically based on your configured strategy. 
                      It continuously learns from market data and adapts to changing conditions.
                    </p>
                  </div>

                  {/* Info Sections Grid */}
                  <div className={cn(
                    "grid gap-4",
                    position === 'sidebar' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
                  )}>
                    {infoSections.map((section, index) => {
                      const IconComponent = section.icon;
                      
                      return (
                        <motion.div
                          key={section.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ 
                            delay: 0.2 + (index * 0.1), 
                            duration: 0.3 
                          }}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className={cn("w-4 h-4", section.color)} />
                            <span className="text-sm font-semibold text-gray-300">
                              {section.title}
                            </span>
                          </div>
                          
                          <ul className="space-y-1.5">
                            {section.items.map((item, itemIndex) => (
                              <motion.li
                                key={itemIndex}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ 
                                  delay: 0.3 + (index * 0.1) + (itemIndex * 0.05),
                                  duration: 0.2 
                                }}
                                className="text-xs text-gray-400 flex items-start gap-2"
                              >
                                <span className={cn("mt-1.5 w-1 h-1 rounded-full flex-shrink-0", 
                                  section.color.replace('text-', 'bg-')
                                )} />
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Additional Info */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="glass-card p-3 rounded-lg bg-blue-500/5 border-blue-500/20"
                  >
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-blue-400">
                          Need Help?
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Visit the settings panel to configure your agent's behavior, risk parameters, 
                          and trading strategies. You can pause or modify the agent at any time.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleInfoPanel;