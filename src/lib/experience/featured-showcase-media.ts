import type { FeaturedExperienceSlug } from "./prototype-registry";

/**
 * `public/media/showcase/` に同名の .mp4 を置くとヒーロー・/demo のカードで自動再生されます。
 * 未配置時はカード側でグラデーションにフォールバックします。
 */
export const FEATURED_SHOWCASE_VIDEO_BY_SLUG: Record<
  FeaturedExperienceSlug,
  string
> = {
  "internal-knowledge-share-bot":
    "/media/showcase/internal-knowledge-share-bot.mp4",
  "restaurant-ops-dashboard-demo":
    "/media/showcase/restaurant-ops-dashboard-demo.mp4",
};
