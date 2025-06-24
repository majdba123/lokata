import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

type Props = {
  type: "slide" | "fade";
  className?: string;
  ads: { src: string; link: string }[];
};

function AdsBoard({ type, className, ads }: Props) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-cycle for fade type
  useEffect(() => {
    if (type === "fade" && ads.length > 1) {
      const interval = setInterval(() => {
        setIsVisible(false);

        setTimeout(() => {
          setCurrentAdIndex((prev) => (prev + 1) % ads.length);
          setIsVisible(true);
        }, 300); // Half of the transition duration
      }, 4000); // Change ad every 4 seconds

      return () => clearInterval(interval);
    }
  }, [type, ads.length]);

  // Handle empty ads array
  if (!ads || ads.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg",
          className
        )}
      >
        <p className="text-gray-500">لا توجد إعلانات للعرض</p>
      </div>
    );
  }

  // Handle single ad
  if (ads.length === 1) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <a
          href={ads[0].link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full transition-transform hover:scale-105"
        >
          <img
            src={ads[0].src || "/placeholder.svg"}
            alt="إعلان"
            className="w-full h-full object-cover"
          />
        </a>
      </div>
    );
  }

  // Slide type using shadcn Carousel
  if (type === "slide") {
    return (
      <div className={cn(className)}>
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          opts={{
            align: "start",
            direction: "rtl",
          }}
          dir="rtl"
          className="w-full"
        >
          <CarouselContent className="h-32 md:h-90">
            {ads.map((ad, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="overflow-hidden w-full h-full rounded-lg">
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full transition-transform hover:scale-105"
                  >
                    <img
                      src={ad.src || "/placeholder.svg"}
                      alt={`إعلان ${index + 1}`}
                      className="w-full h-full object-fill"
                    />
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex items-center justify-center gap-5 mt-6">
            <CarouselPrevious className="static transform-none rotate-180" />
            <CarouselNext className="static transform-none rotate-180" />
          </div>
        </Carousel>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <div className="relative h-32 w-full md:h-90">
        <a
          href={ads[currentAdIndex].link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <img
            src={ads[currentAdIndex].src || "/placeholder.svg"}
            alt={`إعلان ${currentAdIndex + 1}`}
            className={cn(
              "w-full h-full object-fit transition-all duration-600 hover:scale-105",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          />
        </a>
      </div>
    </div>
  );
}

export default AdsBoard;
