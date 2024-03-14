import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="flex lg:flex-row flex-col flex-center gap-28 max-xl:gap-16 p-14 max-lg:gap-10">
          <div className="flex flex-col items-start gap-8 justify-between">
            <h1 className="text-6xl leading-snug font-bold max-sm:text-4xl max-sm:leading-[50px]">
              <span className="whitespace-nowrap relative">Host, Connect,</span>
              <br />
              <span className="inline-block">Celebrate: Your</span>
              <br /> Events, Our Platform!
            </h1>
            <p className="max-w-md text-xl max-md:text-lg">Book and learn helpful tips from 4,000+ mentors in world-class companies with our global community</p>
            <Button size="lg" className="rounded-full w-full sm:w-fit">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>
          <div className="object-contain">
            <Image src="/assets/images/hero.png" alt="Hero" width={400} height={400} />
          </div>
        </div>
      </section>

      <section id="events" className="flex flex-center">
        <div className="flex flex-col items-start gap-8 md:gap-12 max-xl:gap-16 p-14 max-lg:gap-10">
          <h2 className="text-4xl font-bold">Trusted by <br /> thousands of events</h2>
          <div className="flex w-full flex-col gap-5 md:flex-row">
            Search
            Category
          </div>
        </div>
      </section>
    </>
  );
}
