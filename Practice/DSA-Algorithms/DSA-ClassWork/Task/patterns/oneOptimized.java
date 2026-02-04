package Task.patterns;
import java.util.Arrays;
import java.util.Stack;
public class oneOptimized {
    public static void main(String[] args) {
        int[] arr = {7, 2, 1, 4, 3, 2, 2, 2, 2, 5, 1, 8, 2};
        
        int[] ans = new int[arr.length]; 
        int[] index = new int[arr.length]; 
        int[] indexDiff = new int[arr.length]; 

        Stack<Integer> stack = new Stack<>();
        
        for(int i = arr.length-1; i >= 0; i--){
            while(!stack.isEmpty() && arr[i] >= arr[stack.peek()]){
                stack.pop();
            }
            if(stack.isEmpty()){
                ans[i] = -1;
                index[i] = -1;
                indexDiff[i] = -1;
            }else{
                ans[i] = arr[stack.peek()];
                index[i] = stack.peek();
                indexDiff[i] = stack.peek()-i;
            }

            stack.push(i);
        }
        System.out.println(Arrays.toString(ans));
        System.out.println(Arrays.toString(index));
        System.out.println(Arrays.toString(indexDiff));
    }
}
// [8, 4, 4, 5, 5, 5, 5, 5, 5, 8, 8, -1, -1]
// [11, 3, 3, 9, 9, 9, 9, 9, 9, 11, 11, -1, -1]
// [11, 2, 1, 6, 5, 4, 3, 2, 1, 2, 1, -1, -1]