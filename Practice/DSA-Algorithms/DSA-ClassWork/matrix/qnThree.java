public class qnThree {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }
        boolean right = true;

        for (int i = 0; i < matrix.length; i++){
            if(right){
                for(int j = 0; j <  matrix[i].length ; j++){
                    System.out.print(matrix[i][j] + " ");
                }
                right = false;
            }else{
                for(int j = matrix[i].length-1; j >= 0 ; j--){
                    System.out.print(matrix[i][j] + " ");
                }
                right = true;
            }
            System.err.println();
        }
    }
}
