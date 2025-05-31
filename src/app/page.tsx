import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Inbox Zero Game
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Transform your email management into an engaging game
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Feature cards will go here */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
          <p className="text-gray-600">Monitor your journey to inbox zero</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Earn Points</h2>
          <p className="text-gray-600">Get rewarded for managing your inbox</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Level Up</h2>
          <p className="text-gray-600">Unlock achievements and badges</p>
        </div>
      </div>
    </div>
  );
}
