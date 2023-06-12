import { useCallback, useState } from "react";
import { Database } from "../lib/database";
import { anonClient } from "../lib/supabase";

type Image = Database["public"]["Tables"]["eotai_images"]["Row"];

const usePaginatedImages = () => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaginatedImages = useCallback(
    async (
      page: number,
      pageSize: number,
      callback: (imageData: Image[]) => void
    ) => {
      setIsLoading(true);

      setIsLoading(true);
      const { data, error } = await anonClient
        .from("eotai_images")
        .select("*")
        .order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      setIsLoading(false);
      if (error) throw new Error(error.message);
      callback(data);
    },
    []
  );

  return { fetchPaginatedImages, isLoading };
};

export default usePaginatedImages;
