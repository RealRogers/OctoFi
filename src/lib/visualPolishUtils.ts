/**
 * Visual Polish Utilities
 * Tools for ensuring consistent visual design and polish across the dashboard
 */

import { colorContrastUtils } from './accessibilityUtils';

// Design consistency checker
export const designConsistencyChecker = {
  // Check glassmorphism consistency
  checkGlassmorphismConsistency: (elements: HTMLElement[]) => {
    const results: Array<{
      element: string;
      hasBackdropBlur: boolean;
      hasGlassBackground: boolean;
      hasBorder: boolean;
      issues: string[];
    }> = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const issues: string[] = [];
      
      const hasBackdropBlur = computedStyle.backdropFilter.includes('blur');
      const hasGlassBackground = computedStyle.backgroundColor.includes('rgba') || 
                                computedStyle.backgroundColor.includes('hsla');
      const hasBorder = computedStyle.border !== 'none' && computedStyle.border !== '';
      
      if (!hasBackdropBlur) {
        issues.push('Missing backdrop-filter blur');
      }
      
      if (!hasGlassBackground) {
        issues.push('Missing glass background (rgba/hsla)');
      }
      
      if (!hasBorder) {
        issues.push('Missing border for glass effect');
      }

      results.push({
        element: `Element ${index + 1}`,
        hasBackdropBlur,
        hasGlassBackground,
        hasBorder,
        issues
      });
    });

    return results;
  },

  // Check spacing consistency
  checkSpacingConsistency: (elements: HTMLElement[]) => {
    const spacingValues: Record<string, number> = {};
    const inconsistencies: string[] = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const margin = computedStyle.margin;
      const padding = computedStyle.padding;
      const gap = computedStyle.gap;

      // Track spacing values
      [margin, padding, gap].forEach((value, propIndex) => {
        const propName = ['margin', 'padding', 'gap'][propIndex];
        if (value && value !== 'normal' && value !== '0px') {
          const key = `${propName}-${value}`;
          spacingValues[key] = (spacingValues[key] || 0) + 1;
        }
      });
    });

    // Find inconsistencies (values used only once)
    Object.entries(spacingValues).forEach(([key, count]) => {
      if (count === 1) {
        inconsistencies.push(`Unique spacing value: ${key}`);
      }
    });

    return {
      spacingValues,
      inconsistencies,
      mostCommonSpacing: Object.entries(spacingValues)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  },

  // Check color consistency
  checkColorConsistency: (elements: HTMLElement[]) => {
    const colorValues: Record<string, number> = {};
    const contrastIssues: Array<{
      element: string;
      foreground: string;
      background: string;
      ratio: number;
      passes: boolean;
    }> = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      const borderColor = computedStyle.borderColor;

      // Track color usage
      [color, backgroundColor, borderColor].forEach(colorValue => {
        if (colorValue && colorValue !== 'rgba(0, 0, 0, 0)' && colorValue !== 'transparent') {
          colorValues[colorValue] = (colorValues[colorValue] || 0) + 1;
        }
      });

      // Check contrast ratios
      if (color && backgroundColor && 
          backgroundColor !== 'rgba(0, 0, 0, 0)' && 
          backgroundColor !== 'transparent') {
        try {
          const ratio = colorContrastUtils.getContrastRatio(color, backgroundColor);
          const passes = ratio >= 4.5; // WCAG AA standard

          contrastIssues.push({
            element: `Element ${index + 1}`,
            foreground: color,
            background: backgroundColor,
            ratio,
            passes
          });
        } catch (error) {
          // Skip if color parsing fails
        }
      }
    });

    return {
      colorValues,
      contrastIssues: contrastIssues.filter(issue => !issue.passes),
      mostUsedColors: Object.entries(colorValues)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    };
  }
};

// Animation polish checker
export const animationPolishChecker = {
  // Check animation consistency
  checkAnimationConsistency: (elements: HTMLElement[]) => {
    const animationProperties: Record<string, number> = {};
    const transitionProperties: Record<string, number> = {};
    const issues: string[] = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      
      // Check animations
      const animationDuration = computedStyle.animationDuration;
      const animationTimingFunction = computedStyle.animationTimingFunction;
      
      if (animationDuration !== '0s') {
        const key = `${animationDuration}-${animationTimingFunction}`;
        animationProperties[key] = (animationProperties[key] || 0) + 1;
      }

      // Check transitions
      const transitionDuration = computedStyle.transitionDuration;
      const transitionTimingFunction = computedStyle.transitionTimingFunction;
      
      if (transitionDuration !== '0s') {
        const key = `${transitionDuration}-${transitionTimingFunction}`;
        transitionProperties[key] = (transitionProperties[key] || 0) + 1;
      }

      // Check for performance issues
      const transform = computedStyle.transform;
      const willChange = computedStyle.willChange;
      
      if (transform !== 'none' && willChange === 'auto') {
        issues.push(`Element ${index + 1}: Transform without will-change optimization`);
      }
    });

    return {
      animationProperties,
      transitionProperties,
      issues,
      recommendations: [
        'Use consistent animation durations (0.15s, 0.3s, 0.6s)',
        'Use consistent easing functions (cubic-bezier(0.25, 0.1, 0.25, 1))',
        'Add will-change for animated elements',
        'Remove will-change after animations complete'
      ]
    };
  },

  // Check reduced motion compliance
  checkReducedMotionCompliance: () => {
    const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
    const issues: string[] = [];

    animatedElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      
      // Check if element respects prefers-reduced-motion
      const hasReducedMotionQuery = Array.from(document.styleSheets).some(sheet => {
        try {
          return Array.from(sheet.cssRules).some(rule => 
            rule.cssText.includes('prefers-reduced-motion')
          );
        } catch {
          return false;
        }
      });

      if (!hasReducedMotionQuery) {
        issues.push(`Element ${index + 1}: No reduced motion support detected`);
      }
    });

    return {
      animatedElementsCount: animatedElements.length,
      hasGlobalReducedMotionSupport: issues.length === 0,
      issues
    };
  }
};

// Typography polish checker
export const typographyPolishChecker = {
  // Check typography consistency
  checkTypographyConsistency: (elements: HTMLElement[]) => {
    const fontSizes: Record<string, number> = {};
    const fontWeights: Record<string, number> = {};
    const lineHeights: Record<string, number> = {};
    const issues: string[] = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      
      const fontSize = computedStyle.fontSize;
      const fontWeight = computedStyle.fontWeight;
      const lineHeight = computedStyle.lineHeight;

      // Track typography values
      fontSizes[fontSize] = (fontSizes[fontSize] || 0) + 1;
      fontWeights[fontWeight] = (fontWeights[fontWeight] || 0) + 1;
      lineHeights[lineHeight] = (lineHeights[lineHeight] || 0) + 1;

      // Check for accessibility issues
      const fontSizeNum = parseFloat(fontSize);
      if (fontSizeNum < 14) {
        issues.push(`Element ${index + 1}: Font size too small (${fontSize})`);
      }

      const lineHeightNum = parseFloat(lineHeight);
      if (lineHeightNum < 1.2) {
        issues.push(`Element ${index + 1}: Line height too tight (${lineHeight})`);
      }
    });

    return {
      fontSizes,
      fontWeights,
      lineHeights,
      issues,
      recommendations: [
        'Use consistent font scale (12px, 14px, 16px, 18px, 24px, 32px)',
        'Use consistent font weights (400, 500, 600, 700)',
        'Maintain minimum 1.4 line height for readability',
        'Ensure minimum 14px font size for accessibility'
      ]
    };
  }
};

// Layout polish checker
export const layoutPolishChecker = {
  // Check layout consistency
  checkLayoutConsistency: (containers: HTMLElement[]) => {
    const gridProperties: Record<string, number> = {};
    const flexProperties: Record<string, number> = {};
    const issues: string[] = [];

    containers.forEach((container, index) => {
      const computedStyle = window.getComputedStyle(container);
      
      // Check grid properties
      if (computedStyle.display === 'grid') {
        const gridTemplateColumns = computedStyle.gridTemplateColumns;
        const gap = computedStyle.gap;
        
        const gridKey = `${gridTemplateColumns}-${gap}`;
        gridProperties[gridKey] = (gridProperties[gridKey] || 0) + 1;
      }

      // Check flex properties
      if (computedStyle.display === 'flex') {
        const flexDirection = computedStyle.flexDirection;
        const gap = computedStyle.gap;
        const alignItems = computedStyle.alignItems;
        
        const flexKey = `${flexDirection}-${gap}-${alignItems}`;
        flexProperties[flexKey] = (flexProperties[flexKey] || 0) + 1;
      }

      // Check for layout issues
      const overflow = computedStyle.overflow;
      if (overflow === 'visible' && container.scrollWidth > container.clientWidth) {
        issues.push(`Container ${index + 1}: Potential horizontal overflow`);
      }
    });

    return {
      gridProperties,
      flexProperties,
      issues,
      recommendations: [
        'Use consistent grid gaps (16px, 24px, 32px)',
        'Use consistent flex gaps (8px, 16px, 24px)',
        'Ensure containers handle overflow appropriately',
        'Use CSS containment for performance'
      ]
    };
  }
};

// Comprehensive visual audit
export const visualAudit = {
  // Run complete visual audit
  runCompleteAudit: (rootElement: HTMLElement = document.body) => {
    const glassElements = rootElement.querySelectorAll('.glass-card, .glass-card-hover');
    const allElements = rootElement.querySelectorAll('*');
    const containers = rootElement.querySelectorAll('[class*="grid"], [class*="flex"]');
    const textElements = rootElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');

    const auditResults = {
      glassmorphism: designConsistencyChecker.checkGlassmorphismConsistency(
        Array.from(glassElements) as HTMLElement[]
      ),
      spacing: designConsistencyChecker.checkSpacingConsistency(
        Array.from(allElements) as HTMLElement[]
      ),
      colors: designConsistencyChecker.checkColorConsistency(
        Array.from(allElements) as HTMLElement[]
      ),
      animations: animationPolishChecker.checkAnimationConsistency(
        Array.from(allElements) as HTMLElement[]
      ),
      reducedMotion: animationPolishChecker.checkReducedMotionCompliance(),
      typography: typographyPolishChecker.checkTypographyConsistency(
        Array.from(textElements) as HTMLElement[]
      ),
      layout: layoutPolishChecker.checkLayoutConsistency(
        Array.from(containers) as HTMLElement[]
      )
    };

    // Generate summary
    const totalIssues = [
      auditResults.glassmorphism.reduce((sum, item) => sum + item.issues.length, 0),
      auditResults.spacing.inconsistencies.length,
      auditResults.colors.contrastIssues.length,
      auditResults.animations.issues.length,
      auditResults.reducedMotion.issues.length,
      auditResults.typography.issues.length,
      auditResults.layout.issues.length
    ].reduce((sum, count) => sum + count, 0);

    const summary = {
      totalIssues,
      criticalIssues: auditResults.colors.contrastIssues.length + auditResults.typography.issues.length,
      score: Math.max(0, 100 - (totalIssues * 2)), // Deduct 2 points per issue
      recommendations: [
        ...auditResults.animations.recommendations,
        ...auditResults.typography.recommendations,
        ...auditResults.layout.recommendations
      ]
    };

    return {
      ...auditResults,
      summary
    };
  },

  // Generate audit report
  generateAuditReport: (auditResults: any) => {
    const report = `
# Visual Polish Audit Report

## Summary
- **Total Issues:** ${auditResults.summary.totalIssues}
- **Critical Issues:** ${auditResults.summary.criticalIssues}
- **Polish Score:** ${auditResults.summary.score}/100

## Glassmorphism Consistency
${auditResults.glassmorphism.map((item: any, index: number) => 
  `- Element ${index + 1}: ${item.issues.length === 0 ? '✅ Consistent' : '❌ ' + item.issues.join(', ')}`
).join('\n')}

## Color Contrast Issues
${auditResults.colors.contrastIssues.length === 0 ? '✅ No contrast issues found' : 
  auditResults.colors.contrastIssues.map((issue: any) => 
    `- ${issue.element}: Ratio ${issue.ratio.toFixed(2)} (needs 4.5+)`
  ).join('\n')}

## Animation Issues
${auditResults.animations.issues.length === 0 ? '✅ No animation issues found' : 
  auditResults.animations.issues.join('\n- ')}

## Typography Issues
${auditResults.typography.issues.length === 0 ? '✅ No typography issues found' : 
  auditResults.typography.issues.join('\n- ')}

## Recommendations
${auditResults.summary.recommendations.map((rec: string) => `- ${rec}`).join('\n')}
    `.trim();

    return report;
  }
};

// Auto-fix utilities
export const autoFixUtils = {
  // Auto-fix common glassmorphism issues
  autoFixGlassmorphism: (elements: HTMLElement[]) => {
    const fixes: string[] = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      
      // Add backdrop blur if missing
      if (!computedStyle.backdropFilter.includes('blur')) {
        element.style.backdropFilter = 'blur(12px)';
        fixes.push(`Added backdrop blur to element ${index + 1}`);
      }

      // Add glass background if missing
      if (!computedStyle.backgroundColor.includes('rgba')) {
        element.style.backgroundColor = 'rgba(31, 41, 55, 0.3)';
        fixes.push(`Added glass background to element ${index + 1}`);
      }

      // Add border if missing
      if (computedStyle.border === 'none') {
        element.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        fixes.push(`Added glass border to element ${index + 1}`);
      }
    });

    return fixes;
  },

  // Auto-fix animation performance
  autoFixAnimationPerformance: (elements: HTMLElement[]) => {
    const fixes: string[] = [];

    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      
      // Add will-change for animated elements
      if (computedStyle.transform !== 'none' && computedStyle.willChange === 'auto') {
        element.style.willChange = 'transform, opacity';
        fixes.push(`Added will-change optimization to element ${index + 1}`);
      }

      // Add contain for layout stability
      if (!computedStyle.contain.includes('layout')) {
        element.style.contain = 'layout style paint';
        fixes.push(`Added containment to element ${index + 1}`);
      }
    });

    return fixes;
  }
};

// Development polish tools
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Add visual audit tools to window
  (window as any).visualPolish = {
    runAudit: () => visualAudit.runCompleteAudit(),
    generateReport: (results: any) => visualAudit.generateAuditReport(results),
    autoFixGlass: (elements: HTMLElement[]) => autoFixUtils.autoFixGlassmorphism(elements),
    autoFixAnimations: (elements: HTMLElement[]) => autoFixUtils.autoFixAnimationPerformance(elements)
  };

  console.log('Visual polish tools available at window.visualPolish');
}