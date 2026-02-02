package binarySearch;

import java.util.Arrays;

public class LC875 {
    public static int minEatingSpeed(int[] piles, int h) {
        int l = 1, u = Arrays.stream(piles).max().getAsInt(); 

        int mid = l - ( (l-u)/2 );

        while(l <= u){
            int sum = 0;
            for(int i: piles){
                sum += Math.ceil(i/mid);
            }

            if(sum == h)return mid;
            if(sum < h)l = mid+1;
            else u = mid-1;

            mid = l - ( (l-u)/2 );

        }

        return u;
    }

    public static void main(String[] args) {
        int[] arr = {3,6,7,11};
        int h = 8;

        System.out.println(minEatingSpeed(arr, h));

    }
}
