const { mapPriority, PRIORITY_MAP } = require('../utils/priority');

describe('mapPriority', () => {
  it('maps high/normal/low to their bull priority numbers', () => {
    expect(mapPriority('high')).toBe(PRIORITY_MAP.high);
    expect(mapPriority('normal')).toBe(PRIORITY_MAP.normal);
    expect(mapPriority('low')).toBe(PRIORITY_MAP.low);
  });

  it('defaults to normal priority when nothing is passed', () => {
    expect(mapPriority(undefined)).toBe(PRIORITY_MAP.normal);
  });

  it('defaults to normal priority for an unrecognized value', () => {
    expect(mapPriority('urgent-ish')).toBe(PRIORITY_MAP.normal);
  });
});
