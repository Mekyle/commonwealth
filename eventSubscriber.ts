import subscribeEdgewareEvents from './shared/events/edgeware/index';
import { IEventHandler } from './shared/events/interfaces';
import { SubstrateEvent } from './shared/events/edgeware/types';

const url = process.env.NODE_URL || undefined;

class StandaloneSubstrateEventHandler extends IEventHandler<SubstrateEvent> {
  public async handle(event: SubstrateEvent) {
    // just prints the event
    console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
  }
}

const skipCatchup = false;
subscribeEdgewareEvents(url, new StandaloneSubstrateEventHandler(), skipCatchup);
