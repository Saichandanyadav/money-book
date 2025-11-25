export default function ApiGlobalLoader({ loading }) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-sky-500 border-t-transparent rounded-full animate-[spin_1.2s_linear_infinite]"></div>
        <div className="absolute w-14 h-14 border-4 border-sky-500/60 border-b-transparent rounded-full animate-[spin_1.5s_linear_reverse_infinite]"></div>
        <div className="absolute text-sky-500 text-3xl font-bold smooth-pulse animate-[bounce_1.2s_infinite]">
          ₹
        </div>
      </div>
    </div>
  );
}
