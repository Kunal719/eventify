import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/events.actions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  const events = await getAllEvents({ query: '', category: '', page: 1, limit: 6 });
  // console.log(events)

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="wrapper grid grid-cols-1 gap-5 max-sm:gap-6 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col gap-8 justify-center">
            <h1 className="text-5xl leading-snug font-bold max-sm:text-4xl max-sm:leading-[50px]">
              <span className="whitespace-nowrap relative">Host, Connect,</span>
              <br />
              <span className="inline-block">Celebrate: Your</span>
              <br />
              <span className='inline-block'>Events, Our Platform!</span>
            </h1>
            <p className="max-w-md text-xl max-md:text-lg">Book and learn helpful tips from 4,000+ mentors in world-class companies with our global community</p>
            <Button size="lg" className="rounded-full w-full sm:w-fit">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>
          <div>
            <Image src="/assets/images/hero.png" alt="Hero" width={1000} height={1000} className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]" />
          </div>
        </div>
      </section>

      <section id="events" className="flex">
        <div className="wrapper flex flex-col items-start gap-8 md:gap-12 max-xl:gap-16 max-lg:gap-10">
          <h2 className="text-4xl font-bold">Trusted by <br /> thousands of events</h2>
          <div className="flex w-full flex-col gap-5 md:flex-row">
            Search
            Category
          </div>
          <Collection
            data={events?.data}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={6}
            page={1}
            totalPages={2}
          />
        </div>
      </section>
    </>
  );
}
