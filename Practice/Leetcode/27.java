import java.util.*;

class Solution {
    public int removeElement(int[] nums, int val) {
        int k = nums.length;
        for(int i = 0; i < nums.length; i++){
            if(nums[i] == val){
                nums[i] = -1;
                k--;
            }
        }
        Arrays.sort(nums);
        for(int i = 0; i < nums.length - k; i++){
            nums[i] = nums[nums.length-i-1];
            nums[nums.length-i-1] = -1;
        }

        return k;
    }
}