import { CrawlConfig, CrawlerProcess, CrawledRelease } from '../models';
import { concat } from '../utils';
import { crawlDeprecations } from '../crawler';

/**
 * Look for deprecations
 * Adds the deprecations to the release
 */
export function crawl(config: CrawlConfig): CrawlerProcess {
  return concat([
    async (r): Promise<CrawledRelease> => {
      const deprecations = await crawlDeprecations(config, r);
      return {
        ...r,
        deprecations,
      };
    },
  ]);
}
