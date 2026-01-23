package prefix;

public class LeetCode1991 {
    public static int findMiddleIndex(int[] nums) {        
        int[] sumArr = new int[nums.length];
        sumArr[0] = nums[0];

        for(int i = 1; i < sumArr.length; i++){
            sumArr[i] = sumArr[i-1] + nums[i];
            System.out.println(sumArr[i]);
        }

        for(int i = 0; i < sumArr.length; i++){
            if( (i == 0 && sumArr[sumArr.length -1] == 0) || (i == sumArr.length-1 && sumArr[i-1] == 0) )return i;
            if(i == 0)continue;
            System.out.println(sumArr[i-1]);
            System.out.println( ( sumArr[sumArr.length-1] - sumArr[i] ) );

            if(sumArr[i-1] == ( sumArr[sumArr.length-1] - sumArr[i] ) ){
                return i;
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 2, 1};

        System.out.println(findMiddleIndex(nums));
    }
}
