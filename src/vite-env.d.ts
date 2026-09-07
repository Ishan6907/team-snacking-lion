/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Type declarations for packages without @types
declare module 'react-simple-maps' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: GeographyFeature[] }) => ReactNode;
  }

  interface GeographyFeature {
    rsmKey: string;
    properties: Record<string, string>;
    type: string;
    geometry: object;
  }

  interface GeographyProps {
    geography: GeographyFeature;
    key?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
