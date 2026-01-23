public class qnNine {
    public static void main(String[] args) {
        int[][] matrix = new int[5][5];
        int num = 0;
        // Big-O(n^2)
        for (int i = 0; i < matrix.length; i++){
            for(int j = 0; j < matrix[0].length ; j++){
                matrix[i][j] = ++num;
            }
        }

        boolean dir = true;


        // Big-O(n^2)
        for(int i = 0; i < matrix.length; i++){
            int tempi = i;
            
            for(int j = matrix.length-1; j >= matrix.length-1 - tempi; j--){
                int tempj = j;
                
                if(dir){
                    while(tempi >= 0){
                        System.out.print(matrix[tempi--][tempj--] + " ");
                    }
                    dir = false;
                }
                // else{
                //     while(){}
                // }

            }
            System.out.println();
        }

        for(int i = matrix.length-1; i > 0; i--){
            int tempi = i-1;
            
            for(int j = matrix.length-1; j >= 0; j--){
                int tempj = j;
                
                while(tempi >=0){
                    System.out.print(matrix[tempj--][tempi--] + " ");
                }

            }
            System.out.println();
        }
    }
}
