import { useAuth } from "../context/AuthContext";
import { getContent } from "../services/apiContent";
import { useQuery } from "@tanstack/react-query";

export function useContent() {
  const { websiteId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["content", websiteId],
    queryFn: () => getContent(websiteId),
    enabled: websiteId ? true : false,
  });

  // group by page then by section (used by the admin panel)
  const grouped =
    data?.reduce((acc, row) => {
      if (!acc[row.page]) acc[row.page] = {};
      if (!acc[row.page][row.section]) acc[row.page][row.section] = [];
      acc[row.page][row.section].push(row);
      return acc;
    }, {}) ?? {};

  // flat lookup map (used by the public-facing site via c()/cWidth())
  const contentMap =
    data?.reduce((acc, row) => {
      // store with page prefix: "home.header_title", "services.header_title"
      acc[`${row.page}.${row.key}`] = row;
      // also store without prefix for truly global keys
      if (row.page === "global") {
        acc[row.key] = row;
      }
      return acc;
    }, {}) ?? {};

  return { grouped, contentMap, isLoading, error };
}

// Deprecated: kept so any existing imports of useContentInner keep working.
// Delegates to useContent() so there's one query and one source of truth.
export function useContentInner() {
  const { contentMap, isLoading, error } = useContent();
  return { contentMap, isLoading, error };
}
