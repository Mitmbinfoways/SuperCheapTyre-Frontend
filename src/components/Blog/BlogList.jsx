import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getblog } from "../../axios/axios";
import { getBlogImageUrl, formatDateTime } from "../../Utils/Utils";
import Loader from "../common/Loader";
import { GrNext, GrPrevious } from "react-icons/gr";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(undefined);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const payload = {
          page,
          limit,
          isActive: true,
        };
        const res = await getblog(payload);
        const apiBlogs = res?.data?.data?.blogs || [];
        const mapped = apiBlogs.map((b) => {
          const format = b.formate || "card";
          const previewImage =
            format === "carousel"
              ? getBlogImageUrl(b.images?.[0])
              : b.items?.[0]?.imageUrl ||
              getBlogImageUrl(b.items?.[0]?.image || b.images?.[0]);
          const previewContent = b.content || b.items?.[0]?.content || "";
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
          if (typeof p.page === "number") setPage(p.page);
          if (typeof p.limit === "number") setLimit(p.limit);
          if (typeof p.totalPages === "number") setTotalPages(p.totalPages);
        }

        // Set error state if no blogs are found
        if (mapped.length === 0) {
          setError("No blogs found");
        }
      } catch (e) {
        setBlogs([]);
        setError("No blogs found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, limit]);

  if (loading) {
    return <Loader label="Loading blogs..." />;
  }

  // Show error message if there's an error and no blogs to display
  if (error && blogs.length === 0) {
    return (
      <main className="bg-[#F3F3F3] py-8 sm:py-10 md:py-12">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-8">
            Blog
          </h1>
          {/* Error Message */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-[#ED1C24] mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-lexend font-semibold text-gray-800 mb-2">
              Sorry, no blogs were found
            </h3>
            <p className="text-base font-lexend text-gray-600 max-w-md text-center mb-6">
              We couldn't find any blogs matching your current selection.
              Please try adjusting your filters or check back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#ED1C24] text-white font-lexend font-medium rounded-lg hover:bg-[#d11920] transition-colors duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F3F3F3] py-8 sm:py-10 md:py-12">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-8">
          Blog
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {blogs.map((post) => (
            <article
              key={post.id}
              onClick={() => router.push(`/blog/${post.id}`)}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-[8px_3px_22px_10px_#9696961C] cursor-pointer"
            >
              <div className="w-full h-48 sm:h-56 rounded-xl bg-gray-50 flex items-center justify-center p-2 mb-3 relative">
                {post.previewImage ? (
                  <Image
                    src={post.previewImage}
                    alt={post.title}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No image</div>
                )}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {formatDateTime(post.createdAt)}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-black line-clamp-2">
                  {post.title}
                </h2>
                <div className="mt-2 inline-flex items-center gap-2">
                  {post.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] sm:text-xs text-gray-600"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <p
                  className="mt-3 text-sm text-gray-700 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.previewContent }}
                ></p>
                <button className="mt-3 text-[#ED1C24] text-sm font-medium">
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center  flex-wrap gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`min-w-9 h-9 px-3 rounded-md text-sm ${page <= 1 ? "bg-gray-200 text-gray-400" : "bg-black text-white"
              }`}
          >
            <GrPrevious />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`min-w-9 h-9 px-3 rounded-md text-sm ${n === page
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {n}
                </button>
              )
            )}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`min-w-9 h-9 px-3 rounded-md text-sm ${page >= totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-black text-white"
              }`}
          >
            <GrNext />
          </button>
        </div>
      </div>
    </main>
  );
};

export default BlogList;