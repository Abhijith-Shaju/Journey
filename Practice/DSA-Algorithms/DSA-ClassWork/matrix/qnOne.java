public class qnOne {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }

        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                System.out.print(matrix[i][j] + " ");
            }
        }
    }    
}
