package binarySearch;

public class LC153 {
    public static int findMin(int[] nums) {
        int l = 0; 
        int h = nums.length-1;

        int mid = l - ( (l-h)/2 );
    
        while( l <= h ){
            mid = l - ( (l-h)/2 );

            if( nums[l] <= nums[mid] ){
                if(nums[l] <= nums[h]){
                    h = mid-1;
                }else{
                    l = mid+1;
                }
            }else{
                if(nums[h] >= nums[l]){
                    l = mid+1;
                }else{
                    h = mid-1;
                }
            }
        }

        return mid;
    }

    public static void main(String[] args) {
        int[] num = {3, 4 , 5, 1, 2};

        System.out.println(findMin(num));
    }
}
