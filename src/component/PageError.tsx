export default function PageError() {
  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-28 h-28 mb-8 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        role="img"
        aria-label="Error icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
        Oops! Something went wrong
      </h1>
      <p className="text-lg max-w-md mb-10 drop-shadow-md">
        We couldn't complete your request. Please try again later or return to
        the homepage.
      </p>
      <a
        href="/"
        className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
      >
        Go Home
      </a>
    </div>
    </>
  );
}
