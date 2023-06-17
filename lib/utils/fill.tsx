export const fill = <T,>(n: number, f: (i: number) => T) =>
  [...Array(n)].map((_, i) => f(i));

export const rand = () => Math.random() * 2 - 1;
