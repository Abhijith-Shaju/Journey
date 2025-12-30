class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] ans = {-1, -1};

        for(int i = 0; i < nums.length; i++){
            if(nums[i] == target){
                ans[0] = ans[0] == -1 ? i : ans[0] < i ? ans[0] : i;
                ans[1] = Math.max(ans[1], i);
            }
        }

        return ans;
    }
}