var longestOnes = function (nums, k) {
  let ans = 0;
  let zeros = 0;
  let left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] == 0) {
      zeros++;
    }

    while (zeros > k) {
      if (nums[left] == 0) {
        zeros--;
        left++;
      } else {
        left++;
      }
    }
    ans = Math.max(ans, right - left + 1);
  }
  console.log(ans);
  return ans;
};

longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2);
