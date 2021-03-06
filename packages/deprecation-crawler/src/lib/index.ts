import { isCrawlerModeCi } from './utils';
import { guardAgainstDirtyRepo } from './tasks/guard-against-dirty-repository';
import { runCli } from './cli';
import { COMMANDS, OPTIONS } from './constants';

(async () => {
  if (isCrawlerModeCi()) {
    await guardAgainstDirtyRepo();
  }
  runCli({ commands: COMMANDS, options: OPTIONS });
})();
