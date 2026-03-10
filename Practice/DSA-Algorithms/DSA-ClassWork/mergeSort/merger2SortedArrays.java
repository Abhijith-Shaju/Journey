import java.util.*;

public class merger2SortedArrays {
    public static void main(String[] args) {
        int[] arr1 = {1, 3, 4 ,9, 10, 18, 92};
        int[] arr2 = {2, 5, 7, 11, 100, 192, 200, 201};

        int len1 = arr1.length;
        int len2 = arr2.length;

        int[] ans = new int[len1 + len2];
        int i = 0;
        int j = 0;
        int k = 0;

        while( i < len1 && j < len2){
            if(arr1[i] < arr2[j]){
                ans[k++] = arr1[i++];
            }else{
                ans[k++] = arr2[j++];
            }
        }

        while(i < len1){
            ans[k++] = arr1[i++];
        }

        while( j < len2){
            ans[k++] = arr2[j++];
        }

        System.out.println(Arrays.toString(ans));
    }
}
