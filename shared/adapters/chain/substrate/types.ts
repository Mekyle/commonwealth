import BN from 'bn.js';
import { u128, Compact } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { Call } from '@polkadot/types/interfaces';
import { IIdentifiable, ICompletable } from '../../shared';
import { Coin } from '../../currency';
import { BountyStatus } from 'client/scripts/models/types';

export function formatCall(c: Call | { section: string, method: string, args: string[] }): string {
  // build args string
  const args: (string | Codec)[] = c.args;
  const argsStr = args.map((v: Codec | string): string => {
    if (!v) return '[unknown]';
    const vStr = v.toString();
    if (vStr.length < 16) return vStr;
    return `${vStr.slice(0, 15)}…`;
  }).join(', ');

  // finish format
  return `${c.section}.${c.method}(${argsStr})`;
}

export class SubstrateCoin extends Coin {
  constructor(
    denom: string,
    n: number | u128 | BN | SubstrateCoin | Compact<u128>,
    dollar: BN,
    inDollars: boolean = false,
  ) {
    if (n instanceof SubstrateCoin) {
      super(denom, n.asBN, inDollars, dollar);
    } else if (n instanceof Compact || n instanceof u128) {
      super(denom, n.toBn(), inDollars, dollar);
    } else {
      super(denom, n, inDollars, dollar);
    }
  }
}

export enum DemocracyThreshold {
  Supermajorityapproval = 'Supermajorityapproval',
  Supermajorityrejection = 'Supermajorityrejection',
  Simplemajority = 'Simplemajority',
}

export interface ISubstrateDemocracyProposal extends IIdentifiable {
  index: number;
  hash: Uint8Array;
  deposit: u128;
  author: string;
}

export interface ISubstrateDemocracyReferendum extends IIdentifiable {
  index: number;
  hash?: Uint8Array;
  endBlock: number;
  threshold?: DemocracyThreshold;
  executionDelay?: number;
}

export interface ISubstrateTreasuryProposal extends IIdentifiable {
  index: number;
  value: u128;
  beneficiary: string;
  bond: u128;
  proposer: string;
}

export interface ISubstrateBounty extends IIdentifiable {
  index: number;
  proposer: string;
  value: u128;
  fee: u128;
  curator_deposit: u128;
  bond: u128;
  status?: BountyStatus;
}

export interface ISubstrateCollectiveProposal extends IIdentifiable {
  hash: string;
  index: number;
  threshold: number;
}

export interface ISubstratePhragmenElection extends IIdentifiable {
  round: number;
  endBlock: number;
}

export interface IPhragmenVote {
  votes: string[];
  stake: u128;
}

export interface IPhragmenResult {
  who: string;
  score: u128;
}

export interface ISubstratePhragmenElectionState extends ICompletable {
  candidates: string[];
}
