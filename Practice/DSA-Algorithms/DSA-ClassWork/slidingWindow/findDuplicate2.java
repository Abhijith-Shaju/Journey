package slidingWindow;

public class findDuplicate2 {   
    public static boolean containsNearbyDuplicate(int[] nums, int k) {
        if (nums.length <= 1)
            return false;

        int i = 0, j = 1;

        while (i < j && j < nums.length) {            
            if(nums[i] == nums[j] && Math.abs(i - j) <= k){
                return true;
            }

            if(j < nums.length && Math.abs(i - j) < k){
                j++;
            }else{
                i++;
            }
        }

        return false;
    }
    
    public static void main(String[] args) {
        int[] arr = {0,1,2,3,2,5};
        System.out.println(containsNearbyDuplicate(arr, 3));
    }
}
