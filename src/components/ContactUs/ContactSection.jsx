import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatPhoneNumber } from "../../Utils/FormatePhoneNumber";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef(function Card({ className, href, ...props }, ref) {
  const Element = href ? 'a' : 'div';

  return (
    <Element
      ref={ref}
      href={href}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className,
        href && "cursor-pointer"
      )}
      {...(href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

export const ContactSection = ({ contactData }) => {

  const contactCards = [
    {
      title: "Call Us",
      content: contactData?.phone
        ? `${formatPhoneNumber(contactData.phone)}\n24/7 Emergency Line`
        : "0397936190\n24/7 Emergency Line",
      icon: "/contactus/call.svg",
      delay: "200ms",
      href: contactData?.phone ? `tel:${contactData.phone}` : "tel:(03)97942222",
    },
    {
      title: "Hours",
      content: contactData?.openingHours ? (
        <div className="flex flex-col gap-1">
          {contactData.openingHours.map((h, i) => (
            <div key={i} className="flex flex-wrap">
              <span className="font-medium">{h.day} : {h.time} </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span className="font-medium">Monday to Friday:</span>
            <span>9:00 AM - 5:00 PM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Saturday:</span>
            <span>9:00 AM - 3:00 PM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Sunday:</span>
            <span>Closed</span>
          </div>
        </div>
      ),
      icon: "/contactus/clock.svg",
      delay: "400ms",
    },
    {
      title: "Location",
      content: contactData?.address || "114 Hammond Rd, Dandenong South VIC 3175, Australia",
      icon: "/contactus/location.svg",
      delay: "600ms",
      href: contactData?.mapLocation || "https://www.google.com/maps/place/Supercheap+Tyres+Dandenong/@-38.0077899,145.2065489,20.47z/data=!4m15!1m8!3m7!1s0x6ad613c03393e259:0x6e08fd31f52665a5!2s114+Hammond+Rd,+Dandenong+South+VIC+3175,+Australia!3b1!8m2!3d-38.0078006!4d145.206244!16s%2Fg%2F11csllhb_6!3m5!1s0x6ad613f6637330fb:0xd763a0ab7822508d!8m2!3d-38.0078313!4d145.2066405!16s%2Fg%2F1s04wr9dv?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D",
    },
  ];

  return (
    <section className="relative w-full h-auto overflow-visible">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="New WHAT TO LOOK FOR"
        src="/contactus/contactbg.jpeg"
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pt-10">
        <h2 className="animate-fade-in py-10 [font-family:'Lexend',Helvetica] font-bold text-white text-[24px] sm:text-[32px] md:text-[40px] tracking-[0] leading-tight sm:leading-snug md:leading-normal text-center  drop-shadow-md">
          Contact Supercheaptyres Dandenong
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 max-w-full md:max-w-[960px] w-full px-2 md:px-0 py-10 cursor-pointer">
          {contactCards.map((card, index) => (
            <Card
              key={index}
              href={card.href}
              className={`translate-y-[-1rem] animate-fade-in w-full xs:w-[240px] sm:w-[260px] md:w-[300px] h-auto min-h-[180px] sm:min-h-[190px] md:min-h-[205px] bg-[#ff0009] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border border-[#bfbfbf] overflow-hidden`}
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
