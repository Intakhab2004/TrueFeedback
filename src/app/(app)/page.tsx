"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-[linear-gradient(354deg,rgba(0,0,0,1)_0%,rgba(25,25,60,1)_30%,rgba(10,40,60,1)_100%)]">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Conversation
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg font-semibold">
            Explore True Feedback - Where your identity remains a secret.
          </p>
        </section>

        <Carousel className="w-full max-w-xs" plugins={[Autoplay({delay: 2000})]}>
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="h-80">
                    <CardHeader className="text-black/60 dark:text-white/50">{message.title}</CardHeader>
                    <CardContent className="flex flex-col aspect-square items-center p-6 -mt-10">
                      <p className="text-lg font-semibold">
                        {message.content}
                      </p>
                      <p className="text-sidebar-ring text-[0.9rem] mr-42 mt-4">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 border-t-1 border-border">
        <p className="font-semibold">True Feedback - Say What You Really Feel, Anonymously</p>
        <p className="text-[0.8rem] text-sidebar-ring">© 2025 True Feedback. All rights reserved</p>
      </footer>
    </div>
  );
};

export default Homepage;
