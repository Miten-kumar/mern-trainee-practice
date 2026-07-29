// picsum.photos ids that are known to exist, with the actual aspect
// ratio of that photo so the frontend can reserve the right amount of
// space before the image loads (this is what prevents layout shift).
// dominantColor would normally be computed at upload time (e.g. with
// sharp, by downscaling to 1x1px), hardcoded here to keep the backend
// dependency-free for this project.
module.exports = [
  { id: 1, picsumId: 10, width: 1500, height: 1000, alt: 'Forest path', dominantColor: '#5c6b4f' },
  { id: 2, picsumId: 20, width: 3670, height: 2462, alt: 'Laptop on a desk', dominantColor: '#8a8a8a' },
  { id: 3, picsumId: 30, width: 1280, height: 851, alt: 'City street', dominantColor: '#6d6d6d' },
  { id: 4, picsumId: 40, width: 2500, height: 1667, alt: 'Mountain lake', dominantColor: '#4a6f8a' },
  { id: 5, picsumId: 50, width: 5000, height: 3333, alt: 'Beach shoreline', dominantColor: '#c9c1a8' },
  { id: 6, picsumId: 60, width: 4312, height: 2868, alt: 'Old book pages', dominantColor: '#b8a888' },
  { id: 7, picsumId: 70, width: 4899, height: 3265, alt: 'Green hills', dominantColor: '#7a8f5c' },
  { id: 8, picsumId: 80, width: 3888, height: 2592, alt: 'Foggy road', dominantColor: '#9aa3a8' },
  { id: 9, picsumId: 90, width: 4272, height: 2848, alt: 'Boat on water', dominantColor: '#597a8a' },
  { id: 10, picsumId: 100, width: 3888, height: 2592, alt: 'Waterfall', dominantColor: '#6b8f7a' },
  { id: 11, picsumId: 110, width: 2896, height: 1944, alt: 'Desert dunes', dominantColor: '#c9a878' },
  { id: 12, picsumId: 120, width: 5184, height: 3456, alt: 'Snowy peak', dominantColor: '#b8c4cc' },
  { id: 13, picsumId: 130, width: 4256, height: 2832, alt: 'Sunset over water', dominantColor: '#d98c5f' },
  { id: 14, picsumId: 140, width: 6000, height: 4000, alt: 'Autumn leaves', dominantColor: '#a85c3d' },
  { id: 15, picsumId: 150, width: 3888, height: 2592, alt: 'Bridge at night', dominantColor: '#2f3b4f' },
  { id: 16, picsumId: 160, width: 3872, height: 2592, alt: 'Field of flowers', dominantColor: '#8fae5c' },
];
