import { HandRank } from './constants';
import { Cards } from '../card/types'; // import type

export interface HandCandidate {
  readonly pocketCards: Cards;
  readonly communityCards: Cards;
}

export interface Hand {
  readonly rank: HandRank;
  readonly rankValue: number;
  readonly rankCards: Cards;
  readonly kickers: Cards;
}

export type HandExtractor<T = Hand | null> = (cards: Cards) => T;

export interface HandComparisonResult {
  readonly candidate: HandCandidate;
  readonly hand: Hand;
}