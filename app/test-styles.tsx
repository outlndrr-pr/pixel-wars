'use client';

export default function TestStyles() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CSS Test Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl mb-2">Background Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)]">
              --color-background
            </div>
            <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)]">
              --color-card
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Text Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-primary)]">--color-text-primary</span>
            </div>
            <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">--color-text-secondary</span>
            </div>
            <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-tertiary)]">--color-text-tertiary</span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-tertiary">Tertiary Button</button>
            <button className="btn btn-accent">Accent Button</button>
            <button className="btn btn-disabled">Disabled Button</button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Cards</h2>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Card Title</h3>
            <p className="text-[var(--color-text-secondary)]">This is a card with the new styling.</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-accent">Accent</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-error">Error</span>
            <span className="badge badge-info">Info</span>
            <span className="badge badge-default">Default</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl mb-2">Progress Bars</h2>
          <div className="space-y-4">
            <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: '75%',
                  backgroundColor: '#FF5555',
                }}
              />
            </div>
            <div className="h-2 w-full bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: '50%',
                  backgroundColor: '#5555FF',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 