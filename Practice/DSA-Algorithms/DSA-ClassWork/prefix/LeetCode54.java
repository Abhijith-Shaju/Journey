package prefix;

import java.util.ArrayList;
import java.util.List;

public class LeetCode54 {
        public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> arr = new ArrayList<>();
        int rs = 0, re = matrix[0].length-1;
        int cs = 0, ce = matrix.length-1;

        while( (rs <= re) && (cs <= ce) ){

            //left to right
            for(int i = rs; i <= re; i++){
                arr.add(matrix[cs][i]);
            }
            cs++;
            if(cs > ce)break;

            //top to bottom
            for(int i = cs; i <= ce; i++){
                arr.add(matrix[i][re]);
            }
            re--;
            if(rs > re)break;

            //right to left
            for(int i = re; i >= rs; i--){
                arr.add(matrix[ce][i]);
            }
            ce--;
            if(cs > ce)break;

            //bottom to top;
            for(int i = ce; i >= cs; i--){
                arr.add(matrix[i][rs]);
            }
            rs++;
        }
        return arr;
    }

    public static void main(String[] args) {
        
    }
}
