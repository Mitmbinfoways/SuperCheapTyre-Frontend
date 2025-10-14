import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById } from '../../axios/axios';
import { getBlogImageUrl, formatDateTime } from '../../Utils/Utils';
import Loader from '../common/Loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Carousel = ({ images }) => {
  if (!images?.length) return null;
  return (
    <div className="space-y-3">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        autoHeight
        className="rounded-xl"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-96 sm:h-[500px] md:h-[600px] bg-gray-50 flex items-center justify-center px-8">
              <img src={getBlogImageUrl(img)} alt={`slide-${idx}`} className="block max-h-full max-w-full object-contain" />
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next !w-6 !h-6 !text-gray-600 after:!text-sm !right-2 !focus:outline-none"></div>
        <div className="swiper-button-prev !w-6 !h-6 !text-gray-600 after:!text-sm !left-2 !focus:outline-none"></div>
      </Swiper>
    </div>
  );
};

const CardGrid = ({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
      {items.map((it, idx) => (
        <article key={idx} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="w-full h-48 sm:h-56 bg-gray-50 flex items-center justify-center p-2">
            {it.image ? (
              <img src={it.imageUrl || getBlogImageUrl(it.image)} alt={`card-${idx}`} className="block max-h-full max-w-full object-contain" />
            ) : null}
          </div>
          {it.content ? (
            <div className="p-4 sm:p-5 text-sm sm:text-base text-gray-700">{it.content}</div>
          ) : null}
        </article>
      ))}
    </div>
  );
};

const AlternativeList = ({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="space-y-6">
      {items.map((it, idx) => (
        <div key={idx} className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className={`${idx % 2 === 0 ? '' : 'md:order-2'}`}>
            <div className="w-full h-56 sm:h-64 bg-gray-50 rounded-xl flex items-center justify-center p-2">
              {it.image ? (
                <img src={it.imageUrl || getBlogImageUrl(it.image)} alt={`alt-${idx}`} className="block max-h-full max-w-full object-contain" />
              ) : null}
            </div>
          </div>
          <div className={`${idx % 2 === 0 ? '' : 'md:order-1'}`}>
            {it.content ? (
              <p className="text-sm sm:text-base text-gray-700">{it.content}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

const CenterList = ({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="space-y-6">
      {items.map((it, idx) => (
        <div key={idx} className="text-center">
          <div className="w-full max-w-md mx-auto h-56 sm:h-64 bg-gray-50 rounded-xl flex items-center justify-center p-2">
            {it.image ? (
              <img src={it.imageUrl || getBlogImageUrl(it.image)} alt={`center-${idx}`} className="block max-h-full max-w-full object-contain" />
            ) : null}
          </div>
          {it.content ? (
            <p className="mt-4 text-sm sm:text-base text-gray-700">{it.content}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const data = res?.data?.data;
        setBlog(data);
      } catch (e) {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <Loader label="Loading blog..." />;
  if (!blog) return (
    <main className="bg-[#F3F3F3] py-10">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <button className="text-sm text-[#ED1C24] mb-4" onClick={() => navigate(-1)}>← Back</button>
        <div className="bg-white p-6 rounded-2xl">Not found</div>
      </div>
    </main>
  );

  const format = blog.formate || 'card';

  return (
    <main className="bg-[#F3F3F3] py-8 sm:py-10 md:py-12">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-28">
        <button className="text-sm text-[#ED1C24] mb-4" onClick={() => navigate(-1)}>← Back</button>
        <article className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-[8px_3px_22px_10px_#9696961C]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">{blog.title}</h1>
          <div className="mt-1.5 text-xs sm:text-sm text-gray-500">{formatDateTime(blog.createdAt)}</div>

          <div className="mt-6">
            {format === 'carousel' && <Carousel images={blog.images} />}
            {format === 'card' && <CardGrid items={blog.items} />}
            {format === 'alternative' && <AlternativeList items={blog.items} />}
            {format === 'center' && <CenterList items={blog.items} />}
          </div>

          {blog.content ? (
            <p className="mt-5 text-gray-700 text-sm sm:text-base">{blog.content}</p>
          ) : null}

        </article>
      </div>
    </main>
  );
};

export default BlogDetail;


