// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Showcase SERL</h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        Explore various projects that showcase our work and achievements.
      </p>
      <div className="text-center">
        <Link href="/projects">
          <button className="mb-4">
            View Projects
          </button>
        </Link>
      </div>
    </div>
  );
}
