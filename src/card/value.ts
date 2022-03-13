import { Suit, Face } from './constants';

import type { Card } from './types';

/**
 * Returns a face value for a card
 * @param card - Card
 */
export const getFaceValue = ([face]: Card): number =>
  rankedFaces.indexOf(face) + 1;

/**
 * Returns a suit value for a card
 * @param card - Card
 */
export const getSuitValue = ([, suit]: Card): number =>
  Object.values(Suit).indexOf(suit) + 1;

const rankedFaces = [...Object.values(Face).slice(1), Face.Ace];
