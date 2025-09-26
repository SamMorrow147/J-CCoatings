"use client";

interface ServiceIconProps {
  type: 'advertising' | 'design' | 'apparel' | 'promotional' | 'media' | 'podcast';
  size?: number;
  color?: string;
  className?: string;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ 
  type, 
  size = 64, 
  color = '#ffffff',
  className = '' 
}) => {
  const getIcon = () => {
    const commonProps = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: "1.5",
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };

    switch (type) {
      case 'advertising':
        return (
          <svg {...commonProps}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <circle cx="12" cy="10" r="2"/>
          </svg>
        );
      
      case 'design':
        return (
          <svg {...commonProps}>
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
            <path d="M2 2l7.586 7.586"/>
            <circle cx="11" cy="11" r="2"/>
          </svg>
        );
      
      case 'apparel':
        return (
          <svg {...commonProps}>
            <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="15" y2="17"/>
          </svg>
        );
      
      case 'promotional':
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            <path d="M20.49 8.51l-4.24 4.24m-8.49 0L3.51 8.51m16.98 7.98l-4.24-4.24m-8.49 0l-4.24 4.24"/>
          </svg>
        );
      
      case 'media':
        return (
          <svg {...commonProps}>
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            <circle cx="8" cy="12" r="2"/>
          </svg>
        );
      
      case 'podcast':
        return (
          <svg {...commonProps}>
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        );
      
      default:
        return (
          <svg {...commonProps}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`service-icon-container ${className}`}
      style={{ 
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      {getIcon()}
      
      <style jsx>{`
        .service-icon-container {
          display: inline-block;
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        
        .service-icon-container:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ServiceIcon;
