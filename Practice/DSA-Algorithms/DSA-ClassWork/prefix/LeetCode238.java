package prefix;

import java.util.Arrays;

public class LeetCode238 {
    public static int[] productExceptSelf(int[] nums) {
        int[] arr = new int[nums.length];
        int[] pre = new int[nums.length];
        int[] suf = new int[nums.length];

        int mul = 1;
        for(int i = 0; i < nums.length; i++){
            pre[i] = nums[i] * mul;
            mul = pre[i];
        }

        mul = 1;

        for(int i = nums.length-1; i >= 0; i--){
            suf[i] = nums[i] * mul;
            mul = suf[i];
        }


        arr[0] = suf[1];
        for(int i = 1; i < nums.length-1; i++){
            arr[i] = pre[i-1] * suf[i+1];
        }

        arr[arr.length-1] = pre[pre.length-1];
        return arr;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4};
        System.out.println(Arrays.toString(productExceptSelf(arr)));
    }
}



// class Solution {
//     public int[] productExceptSelf(int[] nums) {
//         int[] arr = new int[nums.length];
//         arr[0] = 1;
//         for(int i = 1; i < arr.length; i++){
//             arr[i] = arr[i-1] * nums[i-1];
//         }

//         int suf = 1;
//         for(int i = arr.length-2; i >= 0; i--){
//             suf *= nums[i + 1];
//             arr[i] = arr[i] * suf;
//         }

//         return arr;
//     }
// }



// class Solution {
//     public int[] productExceptSelf(int[] nums) {
//         int[] arr = new int[nums.length];
//         int[] pre = new int[nums.length];
//         int[] suf = new int[nums.length];

//         int mul = 1;
//         for(int i = 0; i < nums.length; i++){
//             pre[i] = nums[i] * mul;
//             mul = pre[i];
//         }

//         mul = 1;
//         for(int i = nums.length-1; i >= 0; i--){
//             suf[i] = nums[i] * mul;
//             mul = suf[i];
//         }

//         arr[0] = suf[1];
//         for(int i = 1; i < nums.length-1; i++){
//             arr[i] = pre[i-1] * suf[i+1];
//         }
//         arr[arr.length-1] = pre[pre.length-2];
//         
//         return arr;
//     }
// }
