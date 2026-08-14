export default function LoadingAdminDashboard() {
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-sand-900">Manage Subjects</h2>
      </div>

      <div className="grid gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/50 opacity-70 animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="h-6 w-1/3 bg-sand-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-sand-200 rounded"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-4 w-full bg-sand-200 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-sand-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-sand-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
