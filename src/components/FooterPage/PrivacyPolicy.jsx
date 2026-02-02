import { useSelector } from 'react-redux';
import { formatPhoneNumber } from '../../Utils/FormatePhoneNumber';
import img from '../../../public/privacy/privacybg.svg'
import Link from 'next/link';

function PrivacyPolicy() {
    const contactInfo = useSelector((state) => state.contact.data);

    return (
        <div className="flex">
            <main className="flex-grow max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 relative overflow-x-hidden">
                <img src={img} className='absolute right-0 -top-16 h-40 sm:h-96 max-w-full pointer-events-none select-none z-0' />
                <div className="relative z-10">
                    {/* Title */}
                    <h1 className="text-xl sm:text-3xl font-medium px-6 sm:px-10 text-red-600 mb-4 sm:mb-6">
                        Privacy Policy
                    </h1>
                    {/* Content */}
                    <div className="px-4 sm:px-10 md:px-20 text-black leading-relaxed text-sm sm:text-base space-y-6">
                        <section>
                            <p>We will respect your privacy at Supercheap Tyres Dandenong and we will not violate your privacy. This Privacy Policy explains our collection, use, storage and disclosure practices with regard to your information as explained by the Australian Privacy Principles as contained in the Privacy Act 1988 (Cth).</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">1. Information We Collect</h2>
                            <p>Personal information that we gather is your name, phone number, email address, vehicle details, billing, payment details and any other information that you use in during contacting us, booking, purchasing products or using our web site.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                            <p className="mb-2">The reason why your personal information is collected:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Sell tyre products and services</li>
                                <li>Booking, order and payment of processes</li>
                                <li>Answer questions and customer service callings</li>
                                <li>Enhance our webpage, services and customer experience</li>
                                <li>Send service updates, confirmations or promotion offers (where legal)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">3. Disclosure of Information</h2>
                            <p>Your personal information is neither sold nor rented. May we can disclose your information to third parties who are trusted in instances of necessity to provide our services e.g. payment processors or service providers or as mandated by law.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">4. Security of Your Information</h2>
                            <p>It is reasonable that we will ensure that your personal information is not abused, lost, accessed or disclosed by unauthorized users. Your data is secured using secure systems and payment gateways.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">5. Cookies & Website Usage</h2>
                            <p>Cookies can be used on our site as a way to make your browsing experience more enjoyable, to differing extents to analyse traffic, and to enhance functionality. I do not mind disabling cookies by setting your browser options.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">6. Access & Correction</h2>
                            <p>You can also demand to see the personal information that we have on you or request to have it fixed in case your information is wrong or missing or is out of date. You can get in touch with us with the following details.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">7. Third-Party Links</h2>
                            <p>There could be links on our site to the third party websites. We have no control over the privacy policies or the contents of such external sites.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">8. Changes to This Policy</h2>
                            <p>We can revise this Privacy Policy occasionally to indicate changes in the laws or business requirements. This page will publish any updates.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">9. Contact Us</h2>
                            <p className="mb-2">In case of any enquiries or further questions regarding this Privacy Policy or how we process your personal information then please contact us:</p>
                            <div className="ml-4">
                                <p className="font-semibold">Supercheap Tyres Dandenong</p>
                                <p>📞 Phone: <Link href={`tel:${formatPhoneNumber(contactInfo?.phone)}`} className="text-red-600 hover:underline">{formatPhoneNumber(contactInfo?.phone)}</Link></p>
                                <p>📧 Email: <Link href={`mailto:${contactInfo?.email}`} className="text-red-600 hover:underline">{contactInfo?.email}</Link></p>
                                <p>📍 Address: <Link href={`${contactInfo?.mapLocation}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{contactInfo?.address}</Link></p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PrivacyPolicy;