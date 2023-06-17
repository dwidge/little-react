// Copyright DWJ 2023.
// Distributed under the Boost Software License, Version 1.0.
// https://www.boost.org/LICENSE_1_0.txt

export const upsert = <T,>(
  a: T[],
  cond: (t: T, i: number, a: T[]) => boolean,
  val: T
): T[] =>
  !a.find(cond) ? [...a, val] : a.map((o, i) => (cond(o, i, a) ? val : o));
