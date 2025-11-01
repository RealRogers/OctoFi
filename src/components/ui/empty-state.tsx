/**
 * EmptyState UI Component
 * Reusable empty state component with animated icons, glow effects, and call-to-action buttons
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ComponentType<any>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  glowColor?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'gray'
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
  animated = true,
  glowColor = 'blue'
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      iconSize: 'w-16 h-16',
      titleSize: 'text-base',
      descriptionSize: 'text-sm',
      spacing: 'space-y-3',
      padding: 'py-8'
    },
    md: {
      iconSize: 'w-24 h-24',
      titleSize: 'text-lg',
      descriptionSize: 'text-sm',
      spacing: 'space-y-4',
      padding: 'py-12'
    },
    lg: {
      iconSize: 'w-32 h-32',
      titleSize: 'text-xl',
      descriptionSize: 'text-base',
      spacing: 'space-y-6',
      padding: 'py-16'
    }
  }

  // Glow color configurations
  const glowColors = {
    blue: 'bg-blue-500/20',
    purple: 'bg-purple-500/20',
    green: 'bg-green-500/20',
    yellow: 'bg-yellow-500/20',
    red: 'bg-red-500/20',
    gray: 'bg-gray-500/20'
  }

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    gray: 'text-gray-400'
  }

  const config = sizeConfig[size]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const MotionContainer = animated ? motion.div : 'div'
  const MotionItem = animated ? motion.div : 'div'

  return (
    <MotionContainer
      className={cn(
        'text-center',
        config.padding,
        config.spacing,
        className
      )}
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
    >
      {/* Animated Icon with Glow Effect */}
      <MotionItem
        className="relative mx-auto mb-6"
        variants={animated ? itemVariants : undefined}
      >
        <div className={cn('relative', config.iconSize, 'mx-auto')}>
          {/* Glow Background */}
          {animated && (
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full blur-2xl',
                glowColors[glowColor]
              )}
              variants={glowVariants}
              animate="pulse"
              style={pulseVariants.pulse}
            />
          )}
          
          {/* Icon */}
          <motion.div
            className="relative z-10"
            variants={animated ? iconVariants : undefined}
          >
            <Icon 
              className={cn(
                config.iconSize,
                iconColors[glowColor],
                'mx-auto'
              )}
            />
          </motion.div>
        </div>
      </MotionItem>

      {/* Title */}
      <MotionItem variants={animated ? itemVariants : undefined}>
        <h3 className={cn(
          'font-semibold text-white mb-2',
          config.titleSize
        )}>
          {title}
        </h3>
      </MotionItem>

      {/* Description */}
      <MotionItem variants={animated ? itemVariants : undefined}>
        <p className={cn(
          'text-gray-400 max-w-md mx-auto mb-6',
          config.descriptionSize
        )}>
          {description}
        </p>
      </MotionItem>

      {/* Actions */}
      {(action || secondaryAction) && (
        <MotionItem 
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          variants={animated ? itemVariants : undefined}
        >
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="min-w-[120px]"
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              className="min-w-[120px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </MotionItem>
      )}
    </MotionContainer>
  )
}

// Predefined empty state variants for common use cases
export const NoDataEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'> & {
  dataType?: string
}> = ({ dataType = 'data', ...props }) => {
  const { BarChart3 } = require('lucide-react')
  
  return (
    <EmptyState
      icon={BarChart3}
      title={`No ${dataType} Available`}
      description={`There is currently no ${dataType} to display. ${dataType.charAt(0).toUpperCase() + dataType.slice(1)} will appear here once available.`}
      glowColor="gray"
      {...props}
    />
  )
}

export const LoadingEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'> & {
  loadingText?: string
}> = ({ loadingText = 'Loading', ...props }) => {
  const { Loader2 } = require('lucide-react')
  
  return (
    <EmptyState
      icon={Loader2}
      title={loadingText}
      description="Please wait while we fetch your data..."
      glowColor="blue"
      animated={true}
      {...props}
    />
  )
}

export const ErrorEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'> & {
  errorMessage?: string
  onRetry?: () => void
}> = ({ errorMessage = 'Something went wrong', onRetry, ...props }) => {
  const { AlertCircle } = require('lucide-react')
  
  return (
    <EmptyState
      icon={AlertCircle}
      title="Error"
      description={errorMessage}
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
        variant: 'default'
      } : undefined}
      glowColor="red"
      {...props}
    />
  )
}

export const WelcomeEmptyState: React.FC<Omit<EmptyStateProps, 'icon' | 'title' | 'description'> & {
  welcomeTitle?: string
  onGetStarted?: () => void
}> = ({ welcomeTitle = 'Welcome!', onGetStarted, ...props }) => {
  const { Sparkles } = require('lucide-react')
  
  return (
    <EmptyState
      icon={Sparkles}
      title={welcomeTitle}
      description="Get started by setting up your first configuration or exploring the available features."
      action={onGetStarted ? {
        label: 'Get Started',
        onClick: onGetStarted,
        variant: 'default'
      } : undefined}
      glowColor="purple"
      {...props}
    />
  )
}

export { EmptyState }