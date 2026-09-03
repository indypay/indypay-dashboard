export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-surface-dark-deep flex items-center justify-center">
        <svg className="w-8 h-8 text-primary-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-primary-green">History</h2>
      <p className="text-muted-DEFAULT max-w-sm">
        Full audit history is coming soon. Check the Transactions page for recent activity.
      </p>
    </div>
  );
}
