import img from '/privacy/privacybg.svg'

function PrivacyPolicy() {
    return (
        <div className="flex">
            
             <main className="flex-grow max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 relative overflow-x-hidden">
             <img src={img} className='absolute right-0 -top-16 h-40 sm:h-96 max-w-full pointer-events-none select-none z-0'/>
                <div className="relative z-10">
                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl font-medium px-6 sm:px-10 text-red-600 mb-4 sm:mb-6">
                        Privacy & Policy
                    </h1>

                    {/* List */}
                    <ol className="list-decimal list-inside space-y-2 sm:space-y-3 px-4 sm:px-10 md:px-20 text-black leading-relaxed text-sm sm:text-base">
                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</li>
                        <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</li>
                        <li>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</li>
                        <li>Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Etiam porta sem malesuada magna mollis euismod.</li>
                        <li>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam id dolor id nibh ultricies vehicula ut id elit.</li>
                        <li>Curabitur blandit tempus porttitor. Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</li>
                        <li>Sed posuere consectetur est at lobortis. Maecenas sed diam eget risus varius blandit sit amet non magna. Nulla vitae elit libero.</li>
                        <li>Donec id elit non mi porta gravida at eget metus. Nullam quis risus eget urna mollis ornare vel eu leo.</li>
                        <li>Etiam porta sem malesuada magna mollis euismod. Nulla vitae elit libero, a pharetra augue. Vestibulum id ligula porta felis euismod semper.</li>
                        <li>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</li>
                    </ol>
                </div>
            </main>
        </div>
    );
}

export default PrivacyPolicy;
