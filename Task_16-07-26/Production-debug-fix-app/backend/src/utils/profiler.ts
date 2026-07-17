export function startTimer(
  label: string
) {

  const start =
    performance.now();


  return function endTimer() {


    const end =
      performance.now();


    const duration =
      end - start;


    console.log(
      `[PROFILE] ${label}: ${duration.toFixed(2)} ms`
    );


    return duration;

  };

}