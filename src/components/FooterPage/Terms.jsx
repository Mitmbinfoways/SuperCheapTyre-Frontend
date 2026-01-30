import img from '../../../public/privacy/privacybg.svg'
import terms from '../../../public/terms/terms.svg'
import { getContactInfoDetail } from '../../axios/axios';
import { formatPhoneNumber } from '../../Utils/FormatePhoneNumber';
import { useEffect, useState } from 'react';

function Terms() {
    const [contactInfo, setContactInfo] = useState([]);

    const getContactInfo = async () => {
        try {
            const response = await getContactInfoDetail();
            setContactInfo(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getContactInfo();
    }, []);
    return (
        <div className="flex">

            <main className="flex-grow max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 relative overflow-x-hidden">
                <img src={img} className='absolute -right-8 -top-24 h-40 sm:h-80 max-w-full pointer-events-none select-none z-0' />
                <div className="relative z-10">
                    {/* Title */}
                    <h1 className="text-xl sm:text-3xl font-medium px-6 sm:px-10 text-red-600 mb-4 sm:mb-6">
                        Terms & Conditions
                    </h1>

                    {/* Content */}
                    <div className="px-4 sm:px-10 md:px-20 text-black leading-relaxed text-sm sm:text-base space-y-6 xl:max-w-[80%]">
                        <section>
                            <p>Welcome to Supercheap Tyres Dandenong. When visiting our site, purchasing the products, making the service reservation, or visiting our store, you accept the following Terms and Conditions. Before utilizing our services, please read them.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">1. General</h2>
                            <p>The Application of these Terms and Conditions to all customers of Supercheap Tyres Dandenong. We may change or amend these terms anytime without giving any notice. Any further use of our services or our web site would be deemed acceptance of any changes.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">2. Products & Services</h2>
                            <p>There are tyres, wheels and services that are all available. Our online prices are liable to change. Our instore prices are liable to change. We take all the efforts possible to make sure that the product descriptions, prices and service details are correct, but some mistakes can still take place, and we have the right to fix them.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">3. Bookings & Appointments</h2>
                            <p>One may also make appointments online, over the phone or in-store. Although we strive to offer services at the time set, we might have delays because of unavoidable situations. Thank you very much and we will keep you posted on any changes where feasible.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">4. Payments</h2>
                            <p>Unless otherwise specified, the payment must be taken at the time of purchase or service. We receive such payment options as Visa, Mastercard, PayPal, Apple Pay, Google Pay and the other accepted options presented on our site. All the prices are expressed in Australian Dollars (AUD).</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">5. Tyre Fitting & Vehicle Responsibility</h2>
                            <p>It is the duty of the customer to make sure that their car is safe, in good condition and fit to have tyres installed or serviced. Supercheap Tyres does not take care of the vehicle damage, worn parts or problems that existed before the services carried out.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">6. Warranty & Liability</h2>
                            <p>Tyre and product warranties are provided by the manufacturer. Supercheap Tyres is also not liable towards any damage due to misuse, incorrectly maintained vehicle, road related risks and neglect of manufacturer instructions. We will only be as liable as allowed under the Australian Consumer Law.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">7. Cancellations & Refunds</h2>
                            <p>Any cancellation or amendments of bookings should be done in advance. Refunds or replacements are based on the product condition, use and manufacturer terms. The fitted or used tyres might not be returned at all unless this is a requirement of law.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">8. Website Use</h2>
                            <p>You will not abuse this site or unlawfully seek to access any content of the site. The Supercheap Tyres Dandenong owns all the content, images, logos and materials on this site and cannot be copied without authorization.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">9. Privacy</h2>
                            <p>Our Privacy Policy that describes the way we collect, store and protect your personal information also governs your use of this site.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">10. Governing Law</h2>
                            <p>These Terms and Conditions are regulated by the Victorian laws, Australia. The conflict will be addressed according to the Australian law.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">11. Contact Us</h2>
                            <p className="mb-2">In case you need any inquiries about these Terms and Conditions, please call us:</p>
                            <div className="ml-4">
                                <p className="font-semibold">Supercheap Tyres Dandenong</p>
                                <p>📞 Phone: <a href={`tel:${formatPhoneNumber(contactInfo?.phone)}`} className="text-red-600 hover:underline">{formatPhoneNumber(contactInfo?.phone)}</a></p>
                                <p>📧 Email: <a href={`mailto:${contactInfo?.email}`} className="text-red-600 hover:underline">{contactInfo?.email}</a></p>
                                <p>📍 Address: <a href={`${contactInfo?.mapLocation}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{contactInfo?.address}</a></p>
                            </div>
                        </section>
                    </div>
                </div>
                <img src={terms} className='hidden xl:block absolute -right-0 top-52 h-40 sm:h-72 max-w-full pointer-events-none select-none' />

            </main>
        </div>
    );
}

export default Terms;