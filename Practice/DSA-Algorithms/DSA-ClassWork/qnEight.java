public class qnEight {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }

        for(int i = 0; i < matrix.length; i++){
            int tempi = 0;
            int tempj = i;
                
            while(tempj >= 0 && tempi < matrix.length){
                System.out.print(matrix[tempi++][tempj--] + " ");
            }

            System.out.println();
        }
    }
}
// sir's answer
// int i = 0, j = 0;
// while( j < 4 ){
//     int k = j;
//     i = 0;
//     while( k >= 0){
//         print(mat[i][k]);
//         i++;
//         k--;
//     }
//     j++;
// }