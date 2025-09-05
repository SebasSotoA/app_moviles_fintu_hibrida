/**
 * Hook para manejar breakpoints responsivos
 * Proporciona utilidades para diseño responsivo
 */

import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { breakpoints } from '../styles/tokens';

export type Breakpoint = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('medium');

  useEffect(() => {
    const updateBreakpoint = () => {
      const { width } = Dimensions.get('window');
      
      if (width < breakpoints.small) {
        setBreakpoint('small');
      } else if (width < breakpoints.medium) {
        setBreakpoint('medium');
      } else if (width < breakpoints.large) {
        setBreakpoint('large');
      } else if (width < breakpoints.xlarge) {
        setBreakpoint('xlarge');
      } else {
        setBreakpoint('xxlarge');
      }
    };

    updateBreakpoint();
    
    const subscription = Dimensions.addEventListener('change', updateBreakpoint);
    
    return () => subscription?.remove();
  }, []);

  return breakpoint;
};

// Hook para verificar si el breakpoint actual es mayor que el especificado
export const useIsBreakpointUp = (targetBreakpoint: Breakpoint): boolean => {
  const currentBreakpoint = useBreakpoint();
  
  const breakpointOrder: Breakpoint[] = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(targetBreakpoint);
  
  return currentIndex >= targetIndex;
};

// Hook para verificar si el breakpoint actual es menor que el especificado
export const useIsBreakpointDown = (targetBreakpoint: Breakpoint): boolean => {
  const currentBreakpoint = useBreakpoint();
  
  const breakpointOrder: Breakpoint[] = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(targetBreakpoint);
  
  return currentIndex <= targetIndex;
};

// Hook para obtener estilos responsivos
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T => {
  const breakpoint = useBreakpoint();
  return values[breakpoint] ?? defaultValue;
};

export default useBreakpoint;
