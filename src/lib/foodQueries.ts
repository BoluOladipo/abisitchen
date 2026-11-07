import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sortFoodsByMenuOrder, type Food } from "@/lib/foods";

export const foodsQueryOptions = () =>
  queryOptions({
    queryKey: ["foods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("foods").select("*").order("sort_order");
      if (error) throw error;
      return sortFoodsByMenuOrder(data as Food[]);
    },
    staleTime: 5 * 60 * 1000,
  });
