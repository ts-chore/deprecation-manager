import { CrawlConfig } from '../models';
import {
  DEFAULT_COMMENT_LINK_TEMPLATE,
  DEFAULT_COMMIT_MESSAGE,
  HEALTH_CHECK_GROUP_NAME,
  SEMVER_TOKEN,
  TAG_FORMAT_TEMPLATE,
  UNGROUPED_GROUP_NAME,
} from '../constants';
import { getSiblingPgkJson, SERVER_REGEX } from '../utils';

export async function ensureConfigDefaults(
  userConfig: CrawlConfig
): Promise<CrawlConfig> {
  return await {
    outputFormatters: [
      'tagBasedMarkdown',
      'groupBasedMarkdown',
      'deprecationIndex',
    ],
    tagFormat: getSuggestedTagFormat(),
    commitMessage: DEFAULT_COMMIT_MESSAGE,
    commentLinkFormat: DEFAULT_COMMENT_LINK_TEMPLATE,
    groups: [
      { key: UNGROUPED_GROUP_NAME, matchers: [] },
      {
        key: HEALTH_CHECK_GROUP_NAME,
        matchers: ['\\/\\*\\* *\\' + userConfig.deprecationComment + ' *\\*/'],
      },
    ],
    include: ['./**/*.ts'],
    exclude: ['./**/*.(spec|test|d).ts'],
    // override defaults with user settings
    ...userConfig,
  };
}

export function getSuggestedTagFormat(): string {
  const pkg = getSiblingPgkJson('./');

  if (!pkg.version) {
    return TAG_FORMAT_TEMPLATE;
  }

  let shell = pkg.version.split('@');
  let start = '';
  // @ present in version e.g. lib-name@1.0.0
  if (shell.length > 1) {
    start = shell[0] + '@';
    shell.shift();
  }

  const semver = SERVER_REGEX.exec(shell[0])[0] || shell[0];
  // semver can be 1.0.0 or v1.0.0
  shell = shell[0].split(semver);
  return [start, shell[0], `\${${SEMVER_TOKEN}}`, shell[1] || ''].join('');
}
