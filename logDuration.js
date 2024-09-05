export default (startTime, endTime) => {
  const durationInSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  console.log(`(Done in: ${minutes}:${seconds})`);
};
