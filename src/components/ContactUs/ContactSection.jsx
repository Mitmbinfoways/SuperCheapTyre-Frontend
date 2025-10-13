import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className,
      )}
      {...props}
    />
  );
});

const CardContent = React.forwardRef(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
});

export const ContactSection = () => {
  const contactCards = [
    {
      title: "Call Us",
      content: "(03) 9794 2222\n24/7 Emergency Line",
      icon: "/contactus/call.svg",
      delay: "200ms",
    },
    {
      title: "Hours",
      content: "Mon-Fri: 7AM-6PM\nSat: 8AM-4PM",
      icon: "/contactus/clock.svg",
      delay: "400ms",
    },
    {
      title: "Location",
      content: "Australia",
      icon: "/contactus/location.svg",
      delay: "600ms",
    },
  ];

  return (
    <section className="relative w-full h-auto overflow-visible">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="New WHAT TO LOOK FOR"
        src="/contactus/contactbg.svg"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pt-10">
        <h2 className="animate-fade-in py-10 [font-family:'Lexend',Helvetica] font-bold text-white text-[24px] sm:text-[32px] md:text-[40px] tracking-[0] leading-tight sm:leading-snug md:leading-normal text-center  drop-shadow-md">
          Contact Supercheaptyres Dandenong
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 max-w-full md:max-w-[960px] w-full px-2 md:px-0 py-10">
          {contactCards.map((card, index) => (
            <Card
              key={index}
              className={`translate-y-[-1rem] animate-fade-in w-full xs:w-[240px] sm:w-[260px] md:w-[280px] h-auto min-h-[180px] sm:min-h-[190px] md:min-h-[205px] bg-[#ff0009] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border border-[#bfbfbf] overflow-hidden`}
              style={{ "--animation-delay": card.delay }}
            >
              <CardContent className="relative h-full p-4 sm:p-5 flex flex-col items-center justify-center gap-2">
                <div className="flex justify-center">
                <img
                  className="object-contain w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11"
                  alt="Contact icon"
                  src={card.icon}
                />
                </div>

                <div className="flex flex-col items-center justify-center px-2.5 py-2 mt-1 sm:mt-2">
                  <div className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm sm:text-lg md:text-xl tracking-[0] leading-snug sm:leading-normal mb-1 sm:mb-2 md:mb-3 text-center">
                    {card.title}
                  </div>

                  <div className="[font-family:'Lexend',Helvetica] font-medium text-[#e7e6e6] text-xs sm:text-sm md:text-base text-center tracking-[0] leading-snug sm:leading-normal whitespace-pre-line break-words">
                    {card.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
