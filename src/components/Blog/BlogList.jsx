import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getblog } from '../../axios/axios';
import { getBlogImageUrl, formatDateTime } from '../../Utils/Utils';
import Loader from '../common/Loader';
import { GrNext , GrPrevious } from "react-icons/gr";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(undefined);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getblog(page, limit);
        const apiBlogs = res?.data?.data?.blogs || [];
        const mapped = apiBlogs.map((b) => {
          const format = b.formate || 'card';
          const previewImage = format === 'carousel'
            ? getBlogImageUrl(b.images?.[0])
            : b.items?.[0]?.imageUrl || getBlogImageUrl(b.items?.[0]?.image || b.images?.[0]);
          const previewContent = b.content || b.items?.[0]?.content || '';
          return {
            id: b._id,
            title: b.title,
            formate: format,
            previewImage,
            previewContent,
            tags: b.tags || [],
            isActive: b.isActive,
            createdAt: b.createdAt,
          };
        });
        setBlogs(mapped);
        const p = res?.data?.data?.pagination;
        if (p) {
          if (typeof p.page === 'number') setPage(p.page);
          if (typeof p.limit === 'number') setLimit(p.limit);
          if (typeof p.totalPages === 'number') setTotalPages(p.totalPages);
        }
      } catch (e) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, limit]);

  if (loading) {
    return <Loader label="Loading blogs..." />;
  }

  return (
    <main className="bg-[#F3F3F3] py-8 sm:py-10 md:py-12">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-8">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {blogs.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-[8px_3px_22px_10px_#9696961C] cursor-pointer"
            >
              <div className="w-full h-48 sm:h-56 rounded-xl bg-gray-50 flex items-center justify-center p-2 mb-3">
                {post.previewImage ? (
                  <img src={post.previewImage} alt={post.title} className="block max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-gray-400 text-sm">No image</div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{formatDateTime(post.createdAt)}</div>
                <h2 className="text-lg sm:text-xl font-semibold text-black line-clamp-2">{post.title}</h2>
                <div className="mt-2 inline-flex items-center gap-2">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[11px] sm:text-xs text-gray-600">#{t}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">{post.previewContent}</p>
                <button className="mt-3 text-[#ED1C24] text-sm font-medium">Read more →</button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center  flex-wrap gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`min-w-9 h-9 px-3 rounded-md text-sm ${page <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-black text-white'}`}
          >
            <GrPrevious />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`min-w-9 h-9 px-3 rounded-md text-sm ${n === page ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`min-w-9 h-9 px-3 rounded-md text-sm ${page >= totalPages ? 'bg-gray-200 text-gray-400' : 'bg-black text-white'}`}
          >
            <GrNext />
          </button>
        </div>
      </div>
    </main>
  );
};

export default BlogList;


