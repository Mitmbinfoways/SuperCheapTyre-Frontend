import React, { useState } from 'react';
import { blogPosts } from '../../assets/data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SectionHeader = ({ title, subtitle }) => (
  <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
    <div className="text-center mb-6 sm:mb-8 md:mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-gray-600">{subtitle}</p>
      )}
    </div>
  </div>
);

const Blog = () => {
  const [activeFormat, setActiveFormat] = useState('carousel'); // 'carousel' | 'cards' | 'alternating'
  const [modalOpen, setModalOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const carouselItems = blogPosts.slice(0, 5);
  const verticalCards = blogPosts;
  const alternating = blogPosts.slice(0, 4);

  const openPost = (post) => {
    setActivePost(post);
    setModalOpen(true);
  };
  const closePost = () => {
    setModalOpen(false);
    setActivePost(null);
  };

  return (
    <main className="bg-[#F3F3F3]">
      {/* Toggle */}
      <section className="pt-8 sm:pt-10 md:pt-12">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-[8px_3px_22px_10px_#9696961C] inline-flex">
            {[
              { key: 'carousel', label: 'Carousel' },
              { key: 'cards', label: 'Cards' },
              { key: 'alternating', label: 'Alternating' },
            ].map((opt) => {
              const active = activeFormat === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setActiveFormat(opt.key)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base transition-colors ${
                    active ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conditional Sections */}
      {activeFormat === 'carousel' && (
        <section className="py-6 sm:py-8 md:py-10">
          <SectionHeader title="Latest Insights" subtitle="Tips and news from Supercheap Tyres" />
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl p-3 sm:p-4 md:p-5 ring-1 ring-gray-200 shadow-sm">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    autoHeight
                    className="rounded-xl"
                  >
                    {carouselItems.map((item) => (
                      <SwiperSlide key={item.id}>
                        <div onClick={() => openPost(item)} className="w-full h-56 sm:h-64 md:h-80 bg-gray-50 flex items-center justify-center cursor-pointer group">
                          <img src={item.image} alt={item.title} className="block max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <hr className="border-gray-200" />
                <div className="flex flex-col justify-center items-center text-center max-w-prose mx-auto">
                  <h3 className="text-xl sm:text-2xl font-semibold text-black">Drive Smarter, Safer</h3>
                  <p className="mt-2 sm:mt-3 text-gray-600 text-sm sm:text-base">
                    Explore our curated articles to help you choose, maintain, and get the most out of your tyres. From rotation schedules to seasonal picks, we cover the essentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeFormat === 'cards' && (
        <section className="py-6 sm:py-8 md:py-10">
          <SectionHeader title="Guides and How‑tos" />
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {verticalCards.map((post) => (
                <article key={post.id} onClick={() => openPost(post)} className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer">
                  <div className="relative w-full h-44 sm:h-48 md:h-52 flex items-center justify-center p-2 sm:p-3 bg-gray-50">
                    <img src={post.image} alt={post.title} className="block max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{post.date}</div>
                    <h4 className="text-base sm:text-lg font-semibold text-black line-clamp-2">{post.title}</h4>
                    <p className="mt-1.5 text-[13px] sm:text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-3 text-xs text-[#ED1C24] font-medium">Read more →</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeFormat === 'alternating' && (
        <section className="py-6 sm:py-8 md:py-10">
          <SectionHeader title="In Focus" />
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 space-y-6 sm:space-y-8">
            {alternating.map((post, idx) => {
              const imageFirst = idx % 2 === 0;
              return (
                <div key={post.id} className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-[8px_3px_22px_10px_#9696961C] bg-white">
                  <div className={`grid md:grid-cols-2 gap-6 md:gap-8 items-center`}>
                    <div className={`${imageFirst ? '' : 'md:order-2'}`}>
                      <div onClick={() => openPost(post)} className="w-full h-56 sm:h-64 md:h-80 rounded-xl flex items-center justify-center p-2 sm:p-3 bg-gray-50 cursor-pointer group">
                        <img src={post.image} alt={post.title} className="block max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                      </div>
                    </div>
                    <div className={`${imageFirst ? '' : 'md:order-1'}`}>
                      <div className="text-xs text-gray-500 mb-2">{post.date} · {post.author}</div>
                      <h4 className="text-2xl font-semibold text-black">{post.title}</h4>
                      <p className="mt-3 text-gray-600 text-sm sm:text-base">{post.excerpt}</p>
                      <button onClick={() => openPost(post)} className="mt-4 inline-flex items-center text-[#ED1C24] text-sm font-medium">Read more →</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal */}
      {modalOpen && activePost && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={closePost}></div>
          <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl">
              <div className="flex justify-between items-center px-4 sm:px-5 py-3 border-b border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-black">{activePost.title}</h3>
                <button onClick={closePost} aria-label="Close" className="text-gray-500 hover:text-black">✕</button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-xs text-gray-500 mb-3">{activePost.date} · {activePost.author}</div>
                <div className="w-full h-56 sm:h-64 md:h-72 bg-gray-50 rounded-xl flex items-center justify-center p-2 sm:p-3 mb-4">
                  <img src={activePost.image} alt={activePost.title} className="block max-h-full max-w-full h-auto w-auto object-contain" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{activePost.content || activePost.excerpt}</p>
              </div>
              <div className="px-4 sm:px-5 py-3 border-t border-gray-200 flex justify-end">
                <button onClick={closePost} className="px-4 py-2 rounded-md bg-black text-white text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Blog;

