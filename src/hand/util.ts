import { memoize } from '../util/function';
import { isInRangeInclusive } from '../util/number';
import { groupBy, differenceWith, chunkPreviousWith } from '../util/array';
import {
  isSameCard,
  compareCards,
  compareFaces,
  compareSuits,
} from '../card/compare';
import { HandRank } from './constants';

import type { Cards } from '../card/types';
import type { HandCandidate, Hand, HandExtractor } from './types';

export const getHandRankValue = (rank: HandRank): number =>
  Object.values(HandRank).indexOf(rank) + 1;

export const getSortedCards = memoize(
  (cards: Cards): Cards => [...cards].sort(compareCards),
);

export const omitAndSort = (from: Cards, cards: Cards): Cards =>
  getSortedCards(differenceWith(isSameCard, from, cards));

export const extractInPreferenceOrder =
  (extractors: HandExtractor[], fallbackExtractor: HandExtractor<Hand>) =>
  ({ pocketCards, communityCards }: HandCandidate): Hand => {
    const cards: Cards = [...pocketCards, ...communityCards];

    return (
      extractors.reduce(
        (result, extractor) => result || extractor(cards),
        null as Hand | null,
      ) || fallbackExtractor(cards)
    );
  };

export const createExtractorResult = (
  rank: HandRank,
  rankCards: Cards,
  cards: Cards,
): Hand => ({
  rank,
  rankCards,
  // Kickers are determined from a 5 card slice of the full hand
  kickerCards: omitAndSort(cards, rankCards).slice(
    0,
    Math.max(0, 5 - rankCards.length),
  ),
});

export const getSortedFaceGroups = memoize((cards: Cards): readonly Cards[] =>
  Object.entries(groupBy(([face]) => face, getSortedCards(cards)))
    .filter(([, groupedCards]) => groupedCards?.length > 1)
    .map(([, groupedCards]) => groupedCards),
);

export const getSortedSuitGroups = memoize((cards: Cards): readonly Cards[] =>
  Object.entries(groupBy(([, suit]) => suit, getSortedCards(cards)))
    .filter(([, groupedCards]) => groupedCards?.length > 1)
    .map(([, groupedCards]) => groupedCards)
    .sort(([a], [b]) => (a && b ? compareSuits(a, b) : 0)),
);

export const getSortedConsequtiveFaceGroups = memoize(
  (cards: Cards): readonly Cards[] =>
    chunkPreviousWith(
      (curr, prev) => isInRangeInclusive(0, 1, compareFaces(curr, prev)),
      getSortedCards(cards),
    ),
);
