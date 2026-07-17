type LogLevel =
  | "INFO"
  | "ERROR"
  | "WARN"
  | "DEBUG";


function log(
  level: LogLevel,
  message: string,
  data?: unknown
) {

  const timestamp =
    new Date().toISOString();


  console.log(
    JSON.stringify({
      timestamp,
      level,
      message,
      data
    })
  );

}


export const logger = {

  info(
    message: string,
    data?: unknown
  ) {
    log(
      "INFO",
      message,
      data
    );
  },


  error(
    message: string,
    data?: unknown
  ) {
    log(
      "ERROR",
      message,
      data
    );
  },


  warn(
    message: string,
    data?: unknown
  ) {
    log(
      "WARN",
      message,
      data
    );
  },


  debug(
    message: string,
    data?: unknown
  ) {
    log(
      "DEBUG",
      message,
      data
    );
  }

};