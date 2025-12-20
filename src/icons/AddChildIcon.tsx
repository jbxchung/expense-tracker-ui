import type { SVGProps } from 'react';

export function AddChildIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
      <line x1="1" y1="2" x2="23" y2="2" />
      <line x1="6" y1="3" x2="6" y2="16" />
      <line x1="6" y1="16" x2="9" y2="16" />
      <ellipse cx="16" cy="16" rx="7" ry="7" />
      <line x1="16" y1="12" x2="16" y2="20" />
      <line x1="12" y1="16" x2="20" y2="16" />
    </svg>
  );
}
