import React from 'react';
import img from '/home/Grouptyre.png'
import bg from '/home/bg.png'



const BuyTyre = () => {
    return (
        <section className="relative bg-primary-dark text-white pt-[100px] sm:pt-0" style={{background: "linear-gradient(to bottom, #ED1C24,#141414)"}}>
        {/* <section className="relative bg-primary-dark text-white pt-[100px] sm:pt-0 inset-0 bg-gradient-to-b from-transparent via-transparent to-black/100" > */}
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 ">
                {/* Search Form */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-6xl mx-auto bg-no-repeat bg-cover bg-center relative z-50 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2" style={{ backgroundImage: `url(${bg})` }}>
                    <h3 className="text-black text-lg sm:text-xl lg:text-2xl font-bold text-center sm:text-left p-2">SEARCH FOR TYRES</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 sm:mt-2">
                        <div className="relative">
                            <select defaultValue="" className="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white">
                                <option value="" >Select a Width</option>
                                <option value="165">165</option>
                                <option value="175">175</option>
                                <option value="185">185</option>
                                <option value="195">195</option>
                                <option value="205">205</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </span>
                        </div>
                        <div className="relative">
                            <select defaultValue="" className="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white">
                                <option value="" >Select a Profile</option>
                                <option value="55">55</option>
                                <option value="60">60</option>
                                <option value="65">65</option>
                                <option value="70">70</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </span>
                        </div>
                        <div className="relative">
                            <select defaultValue="" className="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white">
                                <option value="" >Select a Diameter</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </span>
                        </div>
                        <div className="relative">
                            <select defaultValue="" className="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white">
                                <option value="">Select a Brand</option>
                                <option value="Michelin">Michelin</option>
                                <option value="Goodyear">Goodyear</option>
                                <option value="Pirelli">Pirelli</option>
                                <option value="Continental">Continental</option>
                                <option value="Bridgestone">Bridgestone</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                                </svg>
                            </span>
                        </div>
                        <button className="bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 lg:px-8 rounded-md hover:bg-red-700 active:scale-95 transition-all duration-200 text-base sm:text-lg col-span-1 sm:col-span-2 lg:col-span-1">
                            Select
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 pt-24 sm:pt-28 lg:pt-32 xl:pt-36 pb-10 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center ">
                    <div className="order-2 lg:order-1">
                        <h2 className="font-roboto font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">Buy your tyre</h2>
                        <p className="font-roboto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-200">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sodales dictum aliquam sed ornare tellus sit et ullamcorper velit. Diam cursus eu metus diam donec. Tellus rhoncus feugiat auctor viverra pretium. Id accumsan, augue est purus, vitae est. Risus fames arcu et massa sed parturient risus aenean.
                        </p>
                    </div>
                    <div className="relative order-1 lg:order-2 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[420px] ml-0 lg:ml-0">
                        <div className="absolute inset-0 flex items-center justify-center lg:justify-end pointer-events-none">
                            <div className="relative flex items-center -space-x-8 sm:-space-x-12 md:-space-x-16 lg:-space-x-20 xl:-space-x-24">
                                <div className="relative">
                                    <div className="absolute inset-0 blur-xl opacity-30 rounded-full transform -rotate-12"></div>
                                    <img
                                        src={img}
                                        alt="Tyre"
                                        className="relative -top-20 z-50 w-full h-[580px] object-contain drop-shadow-2xl max-w-[clamp(10rem,40vw,28rem)] sm:max-w-[clamp(12rem,45vw,30rem)] md:max-w-[clamp(14rem,46vw,32rem)] lg:max-w-[clamp(16rem,44vw,34rem)] xl:max-w-[clamp(20rem,40vw,36rem)]"
                                    />
                                </div>
                                {/* <div className="relative">
                                    <div className="absolute inset-0 blur-xl opacity-30 rounded-full transform -rotate-12"></div>
                                    <img
                                        src={images.b}
                                        alt="Tyre"
                                        className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 relative z-20 transform -rotate-12 drop-shadow-2xl"
                                    />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BuyTyre;