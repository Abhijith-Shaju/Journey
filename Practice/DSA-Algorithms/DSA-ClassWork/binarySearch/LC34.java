package binarySearch;

import java.util.Arrays;

public class LC34 {

    public static void binarySearch(int[] arr, int[] ans, int l, int h, int target) {
        int mid = l - ((l - h) / 2);

        while (l <= h) {
            if (arr[mid] == target) {
                if (ans[0] > mid) {
                    ans[0] = mid;
                }
                if (ans[1] < mid) {
                    ans[1] = mid;
                }
        System.out.println(Arrays.toString(ans));

                binarySearch(arr, ans, l, mid - 1, target);
                binarySearch(arr, ans, mid + 1, h, target);

            } else if (target < arr[mid]) {
                h = mid - 1;
            } else {
                l = mid + 1;
            }
            mid = h - ((h - l) / 2);
        }
    }
    public static void main(String[] args) {
        int[] ans = { -1, -1 };

        int[] nums = {5,7,7,8,8,10};
        int target = 8;

        binarySearch(nums, ans, 0, nums.length - 1, target);

        System.out.println(Arrays.toString(ans));
    }
}
