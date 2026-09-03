'use client';
import { Card, Button } from 'antd';
import { ArrowUpRight } from 'lucide-react';

export interface PromotionalCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  borderColor?: string;
  buttonColor?: string;
  icon?: React.ReactNode;
}

const PromotionalCard = ({
  title,
  description,
  buttonText,
  onButtonClick,
  borderColor = '#83BFA7',
  buttonColor = '#83BFA7',
  icon,
}: PromotionalCardProps) => {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${borderColor}80, ${borderColor})`,
        borderRadius: '12px',
        padding: '2px',
      }}
    >
      <Card
        style={{
          background: 'linear-gradient(135deg, #103C28, #1F834C)',
          borderRadius: '10px',
          border: 'none',
        }}
        styles={{
          body: { padding: '32px' },
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {icon && <div style={{ color: '#FFFFFF' }}>{icon}</div>}
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                {title}
              </h2>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text)',
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>

          <Button
            size="large"
            onClick={onButtonClick}
            style={{
              background: `linear-gradient(135deg, ${buttonColor}CC, ${buttonColor})`,
              border: 'none',
              color: 'var(--background)',
              fontWeight: 600,
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
            }}
            icon={<ArrowUpRight size={18} />}
            iconPosition="end"
          >
            {buttonText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PromotionalCard;
