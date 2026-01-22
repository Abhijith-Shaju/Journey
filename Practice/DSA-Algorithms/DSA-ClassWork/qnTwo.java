public class qnTwo {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }

        for (int i = matrix.length-1; i >= 0; i--){
            for(int j = matrix[i].length-1; j >= 0 ; j--){
                System.out.print(matrix[i][j] + " ");
            }
        }
    }
}