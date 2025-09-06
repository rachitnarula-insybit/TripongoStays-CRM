/** @type {import('tailwindcss').Config} */
const designTokens = require('./src/design-system/tokens.json');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: designTokens.colors.brand,
        
        // Neutral colors with Apple-inspired naming
        neutral: designTokens.colors.neutral,
        
        // Semantic colors
        success: designTokens.colors.semantic.success,
        warning: designTokens.colors.semantic.warning,
        error: designTokens.colors.semantic.error,
        info: designTokens.colors.semantic.info,
        
        // Glassmorphism
        glass: designTokens.colors.glassmorphism,
        
        // Legacy color mappings for backward compatibility - Updated to Blue
        primary: {
          blue: designTokens.colors.brand.primary[600],
          'soft-blue': designTokens.colors.brand.primary[400],
          // Keep orange references for gradual transition
          orange: designTokens.colors.brand.primary[600],
          'soft-orange': designTokens.colors.brand.primary[400],
        },
        // Futuristic colors
        futuristic: designTokens.colors.brand.futuristic,
        secondary: {
          blue: designTokens.colors.brand.accent,
          green: designTokens.colors.semantic.success.default,
          red: designTokens.colors.semantic.error.default,
        },
      },
      
      fontFamily: {
        sans: designTokens.typography.fonts.primary,
        mono: designTokens.typography.fonts.mono,
      },
      
      fontSize: {
        xs: [designTokens.typography.scale.xs.fontSize, designTokens.typography.scale.xs.lineHeight],
        sm: [designTokens.typography.scale.sm.fontSize, designTokens.typography.scale.sm.lineHeight],
        base: [designTokens.typography.scale.base.fontSize, designTokens.typography.scale.base.lineHeight],
        lg: [designTokens.typography.scale.lg.fontSize, designTokens.typography.scale.lg.lineHeight],
        xl: [designTokens.typography.scale.xl.fontSize, designTokens.typography.scale.xl.lineHeight],
        '2xl': [designTokens.typography.scale['2xl'].fontSize, designTokens.typography.scale['2xl'].lineHeight],
        '3xl': [designTokens.typography.scale['3xl'].fontSize, designTokens.typography.scale['3xl'].lineHeight],
        '4xl': [designTokens.typography.scale['4xl'].fontSize, designTokens.typography.scale['4xl'].lineHeight],
        '5xl': [designTokens.typography.scale['5xl'].fontSize, designTokens.typography.scale['5xl'].lineHeight],
        '6xl': [designTokens.typography.scale['6xl'].fontSize, designTokens.typography.scale['6xl'].lineHeight],
      },
      
      fontWeight: designTokens.typography.weights,
      
      spacing: designTokens.spacing.scale,
      
      borderRadius: designTokens.borderRadius,
      
      boxShadow: designTokens.shadows,
      
      zIndex: designTokens.zIndex,
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'swift': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'entrance': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'exit': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      screens: designTokens.breakpoints,
    },
  },
  plugins: [
    // Custom utilities for glassmorphism
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-light': {
          backgroundColor: designTokens.colors.glassmorphism.light,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        },
        '.glass-medium': {
          backgroundColor: designTokens.colors.glassmorphism.medium,
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        },
        '.glass-dark': {
          backgroundColor: designTokens.colors.glassmorphism.dark,
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
        },
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-pretty': {
          textWrap: 'pretty',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};