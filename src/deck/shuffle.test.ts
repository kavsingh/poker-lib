import { differenceWith } from '../util/array';
import { isSameCard } from '../card/compare';
import { fullDeckNdo } from './__fixtures__/deck';
import { shuffleDeckNaive, createDeckShuffler } from './shuffle';

describe('shuffle', () => {
  it('asynchronously shuffles a deck using naive shuffler', async () => {
    const deck = [...fullDeckNdo];
    const shuffled = await shuffleDeckNaive(deck);

    expect(shuffled).not.toEqual(deck);
    expect(differenceWith(isSameCard, deck, shuffled)).toHaveLength(0);
    expect(differenceWith(isSameCard, shuffled, deck)).toHaveLength(0);
  });

  it('uses custom shuffle function', async () => {
    const deck = [...fullDeckNdo];
    const shuffle = createDeckShuffler((d) => {
      const result = [...d];

      result.reverse();

      return Promise.resolve(result);
    });
    const shuffled = await shuffle(deck);

    expect(shuffled).not.toEqual(deck);
    expect(shuffled[0]).toEqual(deck.at(-1));
    expect(shuffled.at(-1)).toEqual(deck[0]);
  });
});
