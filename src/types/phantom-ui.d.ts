import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'phantom-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        loading?: boolean;
        animation?: 'pulse' | 'wave' | 'none';
        reveal?: number;
        count?: number;
        'count-gap'?: number;
      };
    }
  }
}
