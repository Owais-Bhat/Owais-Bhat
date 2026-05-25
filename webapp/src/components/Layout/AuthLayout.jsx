export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">CyberMilo</h1>
          <p className="text-white/60 text-sm mt-2">Education OS for the Future</p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 rounded-2xl">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/40 text-xs">
          <p>© 2024 CyberMilo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
