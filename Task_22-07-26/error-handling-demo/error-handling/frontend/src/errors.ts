// base class, every custom error we throw extends this so we can
// check "is this one of ours" with instanceof AppError
export class AppError extends Error {
  type: string;

  constructor(message: string, type: string) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
  }
}

// thrown when fetch() itself fails - no internet, DNS issue, CORS,
// server unreachable etc. There's no response to read in this case.
export class NetworkError extends AppError {
  constructor(message = 'Network error, please check your connection') {
    super(message, 'network');
  }
}

// thrown when we got a response back but the status code means
// something went wrong (4xx or 5xx)
export class ApiError extends AppError {
  status: number;

  constructor(message: string, status: number) {
    super(message, 'api');
    this.status = status;
  }

  // 5xx are usually temporary (server restarting, overloaded etc),
  // 4xx are the client's fault and won't fix themselves on retry
  get isRetryable() {
    return this.status >= 500;
  }
}

// anything else - a bug in our own rendering code, a TypeError from
// accessing something undefined, etc. These get caught by error
// boundaries, not by the api client.
export class RuntimeError extends AppError {
  constructor(message: string) {
    super(message, 'runtime');
  }
}
