import React from 'react';
import { Play, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from './Card';

const AboutUsVideo = () => {
    return (
        <section className="w-full h-full mx-auto">
            <Card className="bg-white rounded-[20px] shadow-sm border-0 h-full flex flex-col">
                <CardContent className="p-6 sm:p-8 md:p-10 lg:p-[40px] flex flex-col">
                    <h2 className="font-lexend font-medium text-black text-2xl sm:text-3xl md:text-[32px] leading-[1.2] mb-6 sm:mb-8 md:mb-[30px]">
                        Key Values & Commitments
                    </h2>

                    <p className="font-lexend  text-[#6e6d6d] text-base sm:text-lg md:text-xl leading-7 md:leading-[30px]">
                        Our values guide every part of our service, from pricing to product selection. We believe in honesty, openness and effective communication, there will be no surprises and no unsaid charges. We focus on customer care whereby we provide advice that is really helpful to your driving purpose. We prioritise safety and quality by stocking reliable, road-tested products and following responsible tyre disposal practices. By continually improving our knowledge, tools and techniques, we stay aligned with industry standards and offer service you can rely on each time.
                    </p>
                </CardContent>
            </Card>
        </section>
    );
};

export default AboutUsVideo;
