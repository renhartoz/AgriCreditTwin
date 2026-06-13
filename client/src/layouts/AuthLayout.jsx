import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #7FFF00, #2D6A4F, transparent 70%)',
            animation: 'auth-float 20s ease-in-out infinite',
          }}
        />
        
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #78c2a4, #E9C46A, transparent 70%)',
            animation: 'auth-float 25s ease-in-out infinite reverse',
          }}
        />
        
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(var(--foreground) 1px, transparent 1px),
              linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      
      <div className="relative z-10 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
