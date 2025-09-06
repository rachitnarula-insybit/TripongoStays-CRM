import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface AIBackgroundAnimationProps {
  className?: string;
}

const AIBackgroundAnimation: React.FC<AIBackgroundAnimationProps> = ({ className }) => {
  // Create neural network nodes
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]', className)}>
      {/* Animated Grid */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-futuristic-neon/5 via-transparent to-brand-primary-500/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-brand-accent" />
        </svg>
      </div>

      {/* Neural Network Nodes */}
      <div className="absolute inset-0">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-1 h-1 bg-brand-accent rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
              x: [0, Math.random() * 20 - 10, 0],
              y: [0, Math.random() * 20 - 10, 0]
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              delay: node.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.slice(0, 6).map((node, index) => {
          const nextNode = nodes[(index + 1) % 6];
          return (
            <motion.line
              key={`line-${index}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${nextNode.x}%`}
              y2={`${nextNode.y}%`}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-brand-accent"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                pathLength: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.5,
                ease: 'easeInOut'
              }}
            />
          );
        })}
      </svg>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-gradient-to-r from-futuristic-electric to-futuristic-neon rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Data Flow Lines */}
      <div className="absolute inset-0">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`flow-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"
            style={{
              top: `${20 + i * 30}%`,
              left: '-10%',
              right: '-10%'
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AIBackgroundAnimation;
