

export default function Spinner({ color }:{ color: string }) {
  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div
        className={`inline-block w-8 h-8 border-4 border-t-transparent border-[${color}] border-solid rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
