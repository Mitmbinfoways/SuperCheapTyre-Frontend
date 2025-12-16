import img from '/privacy/privacybg.svg'

function PrivacyPolicy() {
    return (
        <div className="flex">

            <main className="flex-grow max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 relative overflow-x-hidden">
                <img src={img} className='absolute right-0 -top-16 h-40 sm:h-96 max-w-full pointer-events-none select-none z-0' />
                <div className="relative z-10">
                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl font-medium px-6 sm:px-10 text-red-600 mb-4 sm:mb-6">
                        Privacy Policy
                    </h1>

                    {/* Content */}
                    <div className="px-4 sm:px-10 md:px-20 text-black leading-relaxed text-sm sm:text-base space-y-6">
                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Our Principles</h2>
                            <p>We have a simple approach to data protection and privacy which adheres to the 13 Australian Privacy Principles.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Our obligations under the Privacy Act 1988 (Privacy Act):</h2>
                            <p className="mb-2">This privacy policy sets out how we comply with our obligations under the Privacy Act. As an Australian based organisation, we are bound by the Australian Privacy Principles (APPs) in the Privacy Act which regulate how organisations may collect, use, disclose and store personal information, and how individuals may access and correct personal information held about them.</p>
                            <p>In this privacy policy, 'personal information' has the same meaning as defined by section 6 of the Privacy Act: information or an opinion (including information or an opinion forming part of a database), whether true or not, and whether recorded in a material form or not, about an individual whose identity is apparent, or can reasonably be ascertained, from the information or opinion.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Disclaimer for Supercheap Tyres Dandenong</h2>
                            <p className="mb-2">Any information available on this website is intended to be used as a guide only. It is your responsibility to check the accuracy of the information on which you intend to rely and to obtain independent advice to verify the appropriateness of any vehicle products shown to you on this website.</p>
                            <p>Each State and Territory has separate legislation and regulations governing various vehicle parts and we make no representations about the compliance of any vehicle parts with the relevant regulations of any State or Territory.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Collection</h2>
                            <p>We collect your personal information so that we can provide you with the products, services or information that we supply. Sometimes we collect personal information from a third party or from a publicly available source, but only if you have consented to your information being used in this way, or would reasonably expect us to collect it in this way. We only collect this information from companies or sources that are allowed to disclose it to us. Below you will find a breakdown of the different ways your personal information is collected.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">What We Collect From You</h2>
                            <h3 className="text-base sm:text-lg font-medium mt-3 mb-1">User contact forms</h3>
                            <p className="mb-2">When you fill out a contact form wishing to get in touch with us, we will collect that information and use it to get in touch with you in response to your query. We may use the information to reach out to you to inform you of some of the services we provide, provided it is in line with your original query.</p>

                            <h3 className="text-base sm:text-lg font-medium mt-3 mb-1">Mailing list</h3>
                            <p>If you sign up to one of our mailing lists, this means that you have opted-in and have consented to us sending you emails relating to what we do and provide as a company. Don't worry, we won't spam you. We send all emails as per the guidelines set out by the Australian Communications and Media Authority. You can read more about this in the direct marketing section of this privacy policy.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">What we collect from your online activity</h2>
                            <p className="mb-2">Supercheap Tyres Dandenong uses cookies and other digital identifiers that fall into the following 3 types:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1 mb-2">
                                <li><strong>Site performance indicators:</strong> these give us information on how our websites are used, so that we can make the necessary improvements or amendments to make your experience a better one.</li>
                                <li><strong>Analytics Cookies:</strong> these give us the statistics to understand how many people are on our website, which areas are popular and which areas we need to work on.</li>
                                <li><strong>Advertising Cookies:</strong> we use these cookies to understand what type of advertising would be better suited to someone like you. That way, you would receive ads that are more likely to be relevant to you.</li>
                            </ul>
                            <p><strong>Cookie rights:</strong> You can always disable the use of cookies by changing the security settings of your browser. Just bear in mind that this may affect how some items are displayed on our website.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">What we collect and receive from others</h2>
                            <p className="mb-2">We may also collect personal information from other companies that are able to disclose it to us as this information is received in line with their privacy policies.</p>

                            <h3 className="text-base sm:text-lg font-medium mt-3 mb-1">Social Network widgets and buttons (Pinterest, Twitter etc)</h3>
                            <p className="mb-2">By clicking or using any social network widgets on our website, you understand that you do so according to the terms and privacy policy of those services. 'Liking' or 'Following', and content using these widgets, may become visible to your social network.</p>

                            <h3 className="text-base sm:text-lg font-medium mt-3 mb-1">Maps/Video and other embedded content</h3>
                            <p className="mb-2">Embedded content such as Google Maps, YouTube videos, etc. is embedded or placed on our website - it is not hosted on our servers and therefore any interaction with such services is done so according to their privacy policy.</p>

                            <h3 className="text-base sm:text-lg font-medium mt-3 mb-1">Third party polling and survey plugins (Survey Monkey etc)</h3>
                            <p>When you fill out polls or surveys on our website using a Survey Monkey, PollDaddy or another third party survey provider, please bear in mind that while we retain control of the data that you provide, all data provided is collected under the privacy policy of that provider and so may vary from provider to provider. We do our best to pick providers who adhere to Australian privacy laws.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Use and Disclosure</h2>
                            <p className="mb-2">We only use personal information for the purpose which was requested of us, or for the purposes which directly relate to one of our functions or activities. We will not provide your personal information to other entities or bodies, or any other party unless one of the following applies (as per and in line with APP 6 - use and disclosure of personal information):</p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>You have consented</li>
                                <li>You would reasonably expect, or have been informed, that information of such kind would be passed on to those individuals, entities or bodies (for more information, see subclause 6.2)</li>
                                <li>It is otherwise required or authorised by law, or reasonably necessary for the enforcement of a criminal law or of a law imposing a pecuniary penalty, or for the protection of public revenue</li>
                                <li>It may prevent or lessen a serious and imminent threat to somebody’s life or health.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Direct Marketing</h2>
                            <p className="mb-2">When it comes to direct marketing, no one likes being spammed. At Supercheap Tyres Dandenong, we may use your personal information to send you advertising that is customised to your interests, characteristics or general location.</p>
                            <p><strong>Opt-out:</strong> As with all direct marketing correspondence that you receive from us via email, there is always an unsubscribe button or link located at the bottom of the email. With this you can manage which messages you receive from us.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Quality of Personal Information</h2>
                            <p>We do what we can to keep your personal information up to date and accurate at all times as this allows us to deliver a better service to you. If any information we have for you needs to be corrected, you can contact us via <a href="mailto:supercheaptyre3175@gmail.com" className="text-red-600 hover:underline">supercheaptyre3175@gmail.com</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Data Security</h2>
                            <p className="mb-2">We take active steps to protect the personal information we hold against loss, unauthorised access, use, modification or disclosure, and against other misuse. These steps include password protection for all of our IT systems. While we cannot share with you details of our entire security system for safety reasons, if you have any questions, you can always contact us at <a href="mailto:supercheaptyre3175@gmail.com" className="text-red-600 hover:underline">supercheaptyre3175@gmail.com</a>.</p>
                            <p>When no longer required or requested by you, all personal information is destroyed in a secure manner.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Access and Correction</h2>
                            <p className="mb-2">At Supercheap Tyres Dandenong, we do everything we can to keep your personal information accurate. If you find that any information we hold about you is incorrect, you can contact us at <a href="mailto:supercheaptyre3175@gmail.com" className="text-red-600 hover:underline">supercheaptyre3175@gmail.com</a>, or as per the contact details below and we will endeavour to assist you with your questions. Please bear in mind that under Australian privacy laws, there may be situations where we cannot provide access to such personal information. For instance, if it would reasonably affect someone else’s privacy or may pose a threat to someone’s life, health or safety.</p>
                            <p>For any personal information that is collected by third parties, even when you are visiting our website, it is best to view their privacy policy and seek assistance from those parties directly.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">Complaints Handling</h2>
                            <p className="mb-2">If you have any complaints or feel that there has been a breach of the Australian Privacy Principles, or a registered APP code, you can contact us at <a href="mailto:supercheaptyre3175@gmail.com" className="text-red-600 hover:underline">supercheaptyre3175@gmail.com</a> or via another option below.</p>
                            <p className="mb-2">If you are not satisfied with the process of making a complaint to Supercheap Tyres Dandenong you may make a complaint to the Information Commissioner on the details below:</p>
                            <div className="ml-4">
                                <p className="font-semibold">Office of the Australian Information Commissioner</p>
                                <p>GPO Box 5218 Sydney NSW 2001</p>
                                <p>Email: <a href="mailto:enquiries@oaic.gov.au" className="text-red-600 hover:underline">enquiries@oaic.gov.au</a></p>
                                <p>Telephone: 1300 363 992</p>
                                <p>Fax: 02 9284 9666</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold mb-2">How to Contact Us</h2>
                            <p className="mb-2">We understand that your personal information is important to you and are thrilled that you made it this far! If you have any questions or concerns about this policy or our practices you can get in touch with us:</p>
                            <p>Email: <a href="mailto:supercheaptyre3175@gmail.com" className="text-red-600 hover:underline">supercheaptyre3175@gmail.com</a></p>
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default PrivacyPolicy;
