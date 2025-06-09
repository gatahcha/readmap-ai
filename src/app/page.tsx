import { bookPipeline } from "@/book/bookPipeline";
import { bookNode } from "@/book/bookNode";
import Hero from "@/components/hero";
import ReadingRoadmap from "@/components/reading-roadmap";


interface HomeProps {
  searchParams: { query?: string };
}

export default async function Home({ searchParams }: HomeProps) {

  const params = await searchParams;

  return (
    <main className="w-full h-screen">
      <Hero query={params.query} />
    </main>
  );
}
