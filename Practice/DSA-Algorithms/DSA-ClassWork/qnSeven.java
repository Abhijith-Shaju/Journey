public class qnSeven {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        // Big-O(n^2)
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }

        // Big-O(n^2)
        for(int i = 0; i < matrix.length; i++){
            int tempi = i;
            
            for(int j = matrix.length-1; j >= matrix.length-1 - tempi; j--){
                int tempj = j;
                
                while(tempi >= 0){
                    System.out.print(matrix[tempi--][tempj--] + " ");
                }

            }
            System.out.println();
        }
    }
}
