export default function ApiGlobalLoader({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md flex flex-col justify-center items-center z-[9999]">
      <div className="w-24 h-24 relative">
        <div className="absolute inset-0 rounded-full border-4 border-t-sky-500 border-gray-200 animate-spin"></div>
        <div className="absolute inset-0 flex justify-center items-center text-3xl font-bold text-sky-600">
          💵
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-sky-700 animate-pulse">
        Loading...
      </p>
      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-2 bg-sky-500 animate-loading-bar"></div>
      </div>
    </div>
  );
}
