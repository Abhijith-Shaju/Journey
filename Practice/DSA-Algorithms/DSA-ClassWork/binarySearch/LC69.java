package binarySearch;

public class LC69 {
    public static int mySqrt(int x) {
        int l = 0;
        int h = x;
        int mid = l - ( (l-h)/2 );
        
        while(l <= h){
            if(mid * mid == x)return mid;

            if(mid*mid < x){
                l = mid+1;
            }else{
                h = mid-1;
            }
        }
        return l;
    }

    public static void main(String[] args) {
        System.out.println(mySqrt(8));
    }
}
