import myListReducer, { setMyList, clearMyList } from './myListSlice';

describe('myListSlice', () => {
  const sampleItem = {
    id: 1,
    mediaType: 'movie',
    title: 'Test Movie',
    image: 'https://example.com/poster.jpg',
    itemId: 'movie_1',
  };

  test('returns the initial state', () => {
    const state = myListReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ items: [] });
  });

  test('setMyList replaces the items array', () => {
    const state = myListReducer({ items: [] }, setMyList([sampleItem]));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe('Test Movie');
  });

  test('clearMyList empties the items array', () => {
    const state = myListReducer({ items: [sampleItem] }, clearMyList());
    expect(state.items).toEqual([]);
  });
});