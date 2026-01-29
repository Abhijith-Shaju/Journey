package twoPointers;

import java.util.Arrays;

public class isPalindrome125{
    public static boolean isPalindrome(String s) {
        // if(s.trim().length() == 0)return true;
        // String[] arr = s.trim().toLowerCase().split("[^a-zA-Z0-9]+");
        // System.out.println(Arrays.toString(arr));

        // StringBuilder sb = new StringBuilder();

        // for(String x: arr){
        //     sb.append(x);
        // }

        // arr = sb.toString().split("");
        // int i = 0, j = arr.length-1;
        
        // while(i <= j){
        //     if(arr[i].equals(arr[j])){
        //         i++;
        //         j--;
        //         continue;
        //     }else{

        //         return false;
        //     }
        // }

        // System.out.println(Arrays.toString(arr));

        // return true;



        if(s.trim().length() == 0)return true;
        s = s.replaceAll("[^a-zA-Z0-9]+", "").toLowerCase();

        int i = 0, j = s.length()-1;
        
        while(i <= j){
            if(s.charAt(i) == s.charAt(j) ){
                i++;
                j--;
                continue;
            }else{
                return false;
            }
        }
        
        return true;
    }

    public static void main(String[] args) {
        String s = "ab_a";

        System.out.println(isPalindrome(s));
    }
}