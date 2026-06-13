import { Fragment } from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-center gap-0 w-full max-w-md">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <Fragment key={index}>
              
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-sm font-bold transition-all duration-500 ease-out
                    ${isCompleted
                      ? 'bg-primary text-primary-foreground scale-95 shadow-[0_0_16px_rgba(127,255,0,0.3)]'
                      : isActive
                        ? 'bg-primary text-primary-foreground shadow-[0_0_24px_rgba(127,255,0,0.35)] scale-105 ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground border-2 border-border'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2.5 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                    ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                  `}
                >
                  {step}
                </span>
              </div>

              
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-6 rounded-full overflow-hidden bg-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
