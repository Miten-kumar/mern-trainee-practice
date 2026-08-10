const processEmailJob = require('../processors/emailProcessor');
const processImageJob = require('../processors/imageProcessor');

function fakeJob(data) {
  return { data, progress: jest.fn().mockResolvedValue() };
}

describe('processEmailJob', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves with the sent email details when it succeeds', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9); // above the 0.2 failure threshold

    const job = fakeJob({ to: 'a@b.com', subject: 'Hello' });
    const result = await processEmailJob(job);

    expect(result.sentTo).toBe('a@b.com');
    expect(result.subject).toBe('Hello');
    expect(job.progress).toHaveBeenCalledWith(10);
    expect(job.progress).toHaveBeenCalledWith(50);
    expect(job.progress).toHaveBeenCalledWith(100);
  });

  it('throws when the simulated failure condition hits', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01); // below the 0.2 failure threshold

    const job = fakeJob({ to: 'a@b.com', subject: 'Hello' });
    await expect(processEmailJob(job)).rejects.toThrow(/Failed to send email/);
  });
});

describe('processImageJob', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves with the processed image details when it succeeds', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9); // above the 0.25 failure threshold

    const job = fakeJob({ imageUrl: 'http://x/img.jpg' });
    const result = await processImageJob(job);

    expect(result.processedUrl).toBe('http://x/img.jpg?processed=true');
    expect(result.steps).toEqual(['resizing', 'compressing', 'uploading', 'finalizing']);
    // 4 steps, so progress should have been reported 4 times, ending at 100
    expect(job.progress).toHaveBeenCalledTimes(4);
    expect(job.progress).toHaveBeenLastCalledWith(100);
  });

  it('throws when the simulated failure condition hits', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01); // below the 0.25 failure threshold

    const job = fakeJob({ imageUrl: 'http://x/img.jpg' });
    await expect(processImageJob(job)).rejects.toThrow(/Image processing failed/);
  });
});
