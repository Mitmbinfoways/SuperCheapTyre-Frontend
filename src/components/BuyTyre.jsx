import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "/home/Grouptyre.png";
import bg from "/home/bg.png";
import SingleSelect from "./common/SingleSelect";
import axiosInstance, { getAllBrands } from "../axios/axios";
const BuyTyre = () => {
  const navigate = useNavigate();
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [diameter, setDiameter] = useState("");
  const [brand, setBrand] = useState("");

  // State for API data
  const [widthOptions, setWidthOptions] = useState([
    { value: "", label: "Select a Width" },
  ]);
  const [profileOptions, setProfileOptions] = useState([
    { value: "", label: "Select a Profile" },
  ]);
  const [diameterOptions, setDiameterOptions] = useState([
    { value: "", label: "Select a Diameter" },
  ]);
  const [brandOptions, setBrandOptions] = useState([
    { value: "", label: "Select a Brand" },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await getAllBrands();
      if (response.data.statusCode === 200) {
        const brands = response.data.data.items
          .filter((brand) => brand.category === "tyre")
          .map((brand) => ({
            value: brand.name,
            label: brand.name,
          }));
        setBrandOptions([{ value: "", label: "Select a Brand" }, ...brands]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Fetch master filters (width, profile, diameter) from API
  const fetchMasterFilters = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/masterFilter");
      if (
        response.data.statusCode === 200 &&
        response.data.data.items.length > 0
      ) {
        const tyreData = response.data.data.items.filter(
          (item) => item.category === "tyre"
        );

        // Process width options
        const widthValues = tyreData
          .filter((item) => item.subCategory === "width")
          .map((item) => item.values);
        const uniqueWidths = [...new Set(widthValues)].sort((a, b) => a - b);
        const widthOptions = uniqueWidths.map((width) => ({
          value: width,
          label: width,
        }));
        setWidthOptions([{ value: "", label: "Select a Width" }, ...widthOptions]);

        // Process profile options
        const profileValues = tyreData
          .filter((item) => item.subCategory === "profile")
          .map((item) => item.values);
        const uniqueProfiles = [...new Set(profileValues)].sort((a, b) => a - b);
        const profileOptions = uniqueProfiles.map((profile) => ({
          value: profile,
          label: profile,
        }));
        setProfileOptions([{ value: "", label: "Select a Profile" }, ...profileOptions]);

        // Process diameter options
        const diameterValues = tyreData
          .filter((item) => item.subCategory === "diameter")
          .map((item) => item.values);
        const uniqueDiameters = [...new Set(diameterValues)].sort((a, b) => a - b);
        const diameterOptions = uniqueDiameters.map((diameter) => ({
          value: diameter,
          label: diameter,
        }));
        setDiameterOptions([{ value: "", label: "Select a Diameter" }, ...diameterOptions]);
      }
    } catch (error) {
      console.error("Error fetching master filters:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBrands(), fetchMasterFilters()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle search/filter button click
  const handleSearch = () => {
    // Build query parameters from selected values
    const params = new URLSearchParams();

    if (width) params.append("width", width);
    if (profile) params.append("profile", profile);
    if (diameter) params.append("diameter", diameter);
    if (brand) params.append("brand", brand);

    // Navigate to tyres page with query parameters
    const queryString = params.toString();
    navigate(`/tyres${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <section
      className="relative bg-primary-dark text-white pt-[25px] sm:pt-5"
      style={{ background: "linear-gradient(to bottom, #ED1C24,#141414)" }}
    >
      {/* <section className="relative bg-primary-dark text-white pt-[100px] sm:pt-0 inset-0 bg-gradient-to-b from-transparent via-transparent to-black/100" > */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Search Form */}
        <div
          className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-6xl mx-auto bg-no-repeat bg-cover bg-center relative z-40 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <h3 className="text-black text-lg sm:text-xl lg:text-2xl font-bold text-center sm:text-left p-2">
            SEARCH FOR TYRES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 sm:mt-2">
            <div className="relative">
              <SingleSelect
                options={widthOptions}
                value={width}
                onChange={setWidth}
                selectStyle="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white"
              />
            </div>
            <div className="relative">
              <SingleSelect
                options={profileOptions}
                value={profile}
                onChange={setProfile}
                selectStyle="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white"
              />
            </div>
            <div className="relative">
              <SingleSelect
                options={diameterOptions}
                value={diameter}
                onChange={setDiameter}
                selectStyle="appearance-none text-nowrap rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white"
              />
            </div>
            <div className="relative">
              <SingleSelect
                options={brandOptions}
                value={brand}
                onChange={setBrand}
                selectStyle="appearance-none rounded-md border border-black px-3 sm:px-4 pr-10 py-2 sm:py-3 text-black text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full bg-white"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 lg:px-8 rounded-md hover:bg-red-700 active:scale-95 transition-all duration-200 text-base sm:text-lg col-span-1 sm:col-span-2 lg:col-span-1"
            >
              Select
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 pt-0 sm:pt-0 lg:pt-32 xl:pt-36 pb-10 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center ">
          <div className="order-2 lg:order-1">
            <h2 className="font-roboto font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">
              Buy your tyre
            </h2>
            <p className="font-roboto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sodales
              dictum aliquam sed ornare tellus sit et ullamcorper velit. Diam
              cursus eu metus diam donec. Tellus rhoncus feugiat auctor viverra
              pretium. Id accumsan, augue est purus, vitae est. Risus fames arcu
              et massa sed parturient risus aenean.
            </p>
          </div>
          <div className="relative order-1 lg:order-2 h-0 sm:h-0 md:h-0 lg:h-96 xl:h-[420px] ml-0 lg:ml-0">
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end pointer-events-none">
              <div className="relative flex items-center -space-x-8 sm:-space-x-12 md:-space-x-16 lg:-space-x-20 xl:-space-x-24">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl opacity-30 rounded-full transform -rotate-12"></div>
                  <img
                    src={img}
                    alt="Tyre"
                    className="relative hidden lg:block  xl:-top-14 z-30 w-full h-[580px] object-contain drop-shadow-2xl max-w-[clamp(10rem,40vw,28rem)] sm:max-w-[clamp(12rem,45vw,30rem)] md:max-w-[clamp(14rem,46vw,32rem)] lg:max-w-[clamp(16rem,44vw,34rem)] xl:max-w-[clamp(20rem,40vw,36rem)]"
                  />
                </div>
                {/* <div className="relative">
                                    <div className="absolute inset-0 blur-xl opacity-30 rounded-full transform -rotate-12"></div>
                                    <img
                                        src={images.b}
                                        alt="Tyre"
                                        className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 relative z-20 transform -rotate-12 drop-shadow-2xl"
                                    />
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyTyre;
