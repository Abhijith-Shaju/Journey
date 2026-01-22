public class qnSix {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }

        boolean down = true;
        for (int i = 0; i < matrix.length; i++){
            if(down){
                for(int j = matrix[i].length-1; j >= 0 ; j--){
                    System.out.print(matrix[j][i] + " ");
                }
                down = false;
            }
            else{
                for(int j = 0; j < matrix[i].length ; j++){
                    System.out.print(matrix[j][i] + " ");
                }
                down = true;
            }
        }
    }    
}
