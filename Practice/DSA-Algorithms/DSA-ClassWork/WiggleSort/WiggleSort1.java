package WiggleSort;

public class WiggleSort1 {
    
    public int findMin(int start, int end, int[] arr){
        int min = start;
        for(int i = start; i < end; i++){
            min = (arr[min] < arr[i]) ? min : i;
        }
        return min;
    }

    public int findMax(int start, int end, int[] arr){
        int max = start;
        for(int i = start; i < end; i++){
            max = (arr[max] > arr[i]) ? max : i;
        }
        return max;
    }

    public void wiggleSort(int[] nums) {
        // write your code here
        for(int i = 0; i < nums.length - 1; i++){
            int low = findMin(i, nums.length, nums);
            int high = findMax(i, nums.length, nums);

            int temp = nums[i];
            nums[i] = nums[low];
            nums[low] = temp;

            temp = nums[i+1];
            nums[i+1] = nums[high];
            nums[high] = temp;
        }



    }
}