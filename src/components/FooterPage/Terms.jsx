import img from '/privacy/privacybg.svg'
import terms from '/terms/terms.svg'

function Terms() {
    return (
        <div className="flex">

            <main className="flex-grow max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 relative overflow-x-hidden">
                <img src={img} className='absolute -right-8 -top-24 h-40 sm:h-80 max-w-full pointer-events-none select-none z-0' />
                <div className="relative z-10">
                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl font-medium px-6 sm:px-10 text-red-600 mb-4 sm:mb-6">
                        Price Match Terms and Conditions
                    </h1>

                    {/* List */}
                    <ol className="max-w-5xl list-decimal list-inside space-y-2 sm:space-y-4 px-4 sm:px-10 md:px-12 text-black leading-relaxed text-sm sm:text-base">
                        <li>Matching applies to physical retail stores only.</li>
                        <li>Proof of competitors valid sales quotation required.</li>
                        <li>No verbal quotations accepted.</li>
                        <li>Prices must include fitting, balancing, tyre recycling and tubeless valve replacement.</li>
                        <li>The offer ceases once fitment has started or purchase is done.</li>
                        <li>Excludes liquidation and aged stock.</li>
                        <li>Excludes wheel and tyres package deal.</li>
                        <li>Competitor must have stock available locally for immediate purchase.</li>
                        <li>Not valid with any promotional offer or cash back.</li>
                        <li>Excludes purchase made on finance.</li>
                        <li>Private Buyers only.</li>
                        <li>Claims are subject to verification/approval and Goodwillmotors Pty Ltd T/A Supercheap Tyres Dandenong reserve the right to refuse a claim that cannot be adequately substantiated.</li>
                    </ol>
                </div>
                <img src={terms} className='hidden xl:block absolute -right-0 top-52 h-40 sm:h-72 max-w-full' />

            </main>
        </div>
    );
}

export default Terms;
