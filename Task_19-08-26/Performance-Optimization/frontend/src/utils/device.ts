export const getDeviceType = (): 
  "mobile" | "desktop" => {
  return window.matchMedia(
    "(max-width: 768px)"
  ).matches
    ? "mobile"
    : "desktop";
};