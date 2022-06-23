import newrelic from 'newrelic';

import { ValueProvider } from '@nestjs/common';

export type NewRelic = typeof newrelic;

export const NEW_RELIC_TOKEN = 'NEW_RELIC_TOKEN';

/**
 * Makes new relic available to all modules.
 */
export const newRelicProvider: ValueProvider<NewRelic> = {
  provide: NEW_RELIC_TOKEN,
  useValue: newrelic,
};
