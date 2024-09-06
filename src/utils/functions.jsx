export const generateRandomNumber = (limit) => {
  return Math.floor(Math.random() * limit) + 1;
};

export const mobileChecker = () => {
  return window.innerWidth < 500 || window.innerHeight < 500
}