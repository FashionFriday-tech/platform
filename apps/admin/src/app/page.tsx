export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-sm text-white/60 font-medium mb-2">Total Revenue</h3>
          <div className="text-3xl font-semibold tracking-tight">$45,231.89</div>
          <p className="text-sm text-green-400 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +20.1% from last month
          </p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-sm text-white/60 font-medium mb-2">Active Orders</h3>
          <div className="text-3xl font-semibold tracking-tight">+573</div>
          <p className="text-sm text-green-400 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +184 in last 7 days
          </p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-sm text-white/60 font-medium mb-2">New Customers</h3>
          <div className="text-3xl font-semibold tracking-tight">+2,129</div>
          <p className="text-sm text-white/40 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            Stable across last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-medium mb-6 border-b border-white/10 pb-4">Revenue Overview</h3>
          <div className="flex-1 flex items-center justify-center opacity-50 border border-dashed border-white/20 rounded-lg">
            <p className="text-white/60">Chart placeholder. Add Recharts or Chart.js here.</p>
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h3 className="text-lg font-medium mb-6 border-b border-white/10 pb-4">Recent Sales</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-medium">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customer {i}</p>
                    <p className="text-xs text-white/50">customer{i}@example.com</p>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  +${(Math.random() * 200 + 50).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
