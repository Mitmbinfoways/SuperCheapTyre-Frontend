import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTyres = async (params = {}) => {
  // Extract page and limit from params, or set defaults
  const { page, limit, ...otherParams } = params;

  // Create query parameters
  const queryParams = new URLSearchParams();

  // Add pagination parameters if provided
  if (page !== undefined) queryParams.append("page", page);
  if (limit !== undefined) queryParams.append("limit", limit);

  // Add other parameters
  Object.keys(otherParams).forEach((key) => {
    if (otherParams[key] !== undefined) {
      queryParams.append(key, otherParams[key]);
    }
  });

  // Construct the URL with query parameters
  const url = `/api/v1/product${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return axiosInstance.get(url);
};

export const getAllTyres = async (search) => {
  return axiosInstance.get(`/api/v1/product?search=${search}`);
};

export const getTyreById = async (id) => {
  return axiosInstance.get(`/api/v1/product/${id}`);
};

export const getSimilarProducts = async (id) => {
  return axiosInstance.get(`/api/v1/product/${id}/similar`);
};

export const CreateContact = async (payload) => {
  return axiosInstance.post(`/api/v1/contact`, payload);
};

export const getTimeslot = async () => {
  return axiosInstance.get(`/api/v1/timeslot`);
};

export const getGetHolidays = async () => {
  return axiosInstance.get(`/api/v1/holiday`);
};

export const getavailableslots = async () => {
  return axiosInstance.get(`/api/v1/appointment/slots`);
};

export const getAllBrands = async () => {
  return axiosInstance.get(`/api/v1/brand`);
};

export const getAppointmentSlots = async (date, timeSlotId) => {
  return axiosInstance.get(
    `/api/v1/appointment/slots?date=${date}&timeSlotId=${timeSlotId}`
  );
};

export const gethomedata = async () => {
  return axiosInstance.get(`/api/v1/product/homedata`);
};

export const getblog = async (data) => {
  const params = {};
  if (data.page !== undefined) params.page = data.page;
  if (data.limit !== undefined) params.limit = data.limit;
  if (data.isActive !== undefined) params.isActive = data.isActive;

  return axiosInstance.get("/api/v1/blog", { params });
};

export const getBlogById = async (id) => {
  return axiosInstance.get(`/api/v1/blog/${id}`);
};

export const createAppointment = async (data) => {
  return axiosInstance.post("/api/v1/appointment", data);
};

export const createOrder = async (data) => {
  return axiosInstance.post("/api/v1/order", data);
};

export const getBanners = async () => {
  return axiosInstance.get(`/api/v1/banner`);
};

export default axiosInstance;
