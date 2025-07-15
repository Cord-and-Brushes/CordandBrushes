// src/customer/hooks/useBannerImages.js
import { useState, useEffect } from "react";
import api from "../../../api/api";

const useBannerImages = (pageName) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/banners/allbanners");
        const pageBanner = response.data.find(
          (banner) => banner.pageName === pageName
        );
        setBanners(pageBanner?.urls || []);
      } catch (err) {
        setError("Failed to load banners");
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [pageName]);

  return { banners, loading, error };
};

export default useBannerImages;
