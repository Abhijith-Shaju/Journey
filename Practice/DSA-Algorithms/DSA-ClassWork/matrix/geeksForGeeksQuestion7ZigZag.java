import java.util.ArrayList;

public class geeksForGeeksQuestion7ZigZag {
    public static void main(String[] args) {

        int[][] mat = new int[5][5];
        int num = 0;
        for (int i = 0; i < mat.length; i++){
            for(int j = 0; j < mat[0].length ; j++){
                mat[i][j] = ++num;
            }
        }
        
        ArrayList<Integer> ans = new ArrayList<>();
        
        // boolean dir = true;
        // int bottom = mat.length-1, right = mat[0].length;

        boolean hitL = true, hitT = false, hitR = false, hitB = false;

        int i = 0, j = 0;

        while ( (i+j) <= (mat.length + mat[0].length) ){
            if(hitL || hitB){
                if(i == 0){hitT = true; hitB = false;}
                if(i == mat.length-1){hitB = true; hitT = false;}
                if(j == 0){hitL = true; hitR = false;}
                if(j == mat[0].length-1){hitR = true; hitL = false;}
                
                ans.add(mat[i][j]);
                if(i == 0)j++;
                else{
                    i--;
                    j++;
                }

            }
        }

        for(int temp : ans){
            System.out.println(temp);
        }
    }

}



// ZigZag metrix : 
// // User function Template for C++
// //Back-end complete function Template for C++
// class Solution {
//   public:
//     vector<int> zigZagMatrix(vector<vector<int>> &mat) {
//         // Your code here
//         int n = mat.size();
//         int m = mat[0].size();
//         vector<int> ans;
//         for(int col=0;col<n+m-1;col++){
//             if(col%2==0){
//                 int i = min(col, n - 1);
//                 int j = col - i;
//                 while (i >= 0 && j < m) {
//                     ans.push_back(mat[i][j]);
//                     i--;
//                     j++;
//                 }
//             } 
//             else {
//                 int j = min(col, m - 1);
//                 int i = col - j;
                
//                 while (j >= 0 && i < n) {
//                     ans.push_back(mat[i][j]);
//                     i++;
//                     j--;
//                 }
//             }
//         }
//         return ans;
//     }
// };