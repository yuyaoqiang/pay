
export const isJudge = function(flag: boolean) {
  return function(first: any, second: any) {
    if (flag) {
      return first;
    } else {
      return second;
    }
  };
};
