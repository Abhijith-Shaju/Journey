import java.util.Scanner;

public class inversionCount {
    static int helper(int[] arr, int l, int r){
        if(l >= r){
            return 0;
        }
        if(arr[l] > arr[r])return 1;
        
        int mid = (l+r)/2;
        
        return helper(arr, l, mid) + helper(arr, mid+1, r);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int inputs = sc.nextInt();

        while(inputs-- > 0){
            int len = sc.nextInt();
            int[] arr = new int[len];
            
            for(int i = 0; i < len; i++) arr[i] = sc.nextInt();
            
            int count = helper(arr, 0, len-1);

            System.out.println("count = " + count);
        }
        sc.close();
    }
}
