export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Skeleton */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-pulse"></div>
              <div className="h-6 w-32 bg-white/10 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-32 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Action Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse"></div>
                  <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
