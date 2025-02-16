import { ChainClass, NodeInfo } from 'models';
import { IApp } from 'state';
import * as plasmDefinitions from '@plasm/types/interfaces/definitions';

import Substrate from '../substrate/main';

class Plasm extends Substrate {
  constructor(n: NodeInfo, app: IApp) {
    super(n, app, ChainClass.Plasm);
  }

  public async initApi() {
    const t = Object.values(plasmDefinitions)
      .reduce((res, { types }): object => ({ ...res, ...types }), {});
    await super.initApi({
      'types': { ...t }
    });
  }
}

export default Plasm;
