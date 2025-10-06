export const NumberFormatter = (n: number) => {
  if (n < 1000) {
    return n.toFixed(0).toString();
  } else if (n < 1000000) {
    return `${(n / 1000).toFixed(1)}K`;
  } else {
    return `${(n / 1000000).toFixed(1)}M`;
  }
};
