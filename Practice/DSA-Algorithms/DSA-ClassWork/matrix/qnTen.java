import java.util.ArrayList;

public class qnTen {
    public static void main(String[] args) {

        int[][] mat = new int[5][5];
        int num = 0;
        for (int i = 0; i < mat.length; i++){
            for(int j = 0; j < mat[0].length ; j++){
                mat[i][j] = ++num;
            }
        }
        
        ArrayList<Integer> ans = new ArrayList<>();
        
        boolean dir = true;
        
        for(int i = 0; i < mat.length; i++){
            
            if(dir){
                int tempi = i;
                int tempj = 0;
                
                while(tempi >= 0 && tempj < mat.length){
                    ans.add( mat[tempi--][tempj++] );
                }
                dir = false;
            }else{
                int tempi = 0;
                int tempj = i;
                
                while(tempj >= 0 && tempi < mat.length){
                    ans.add( mat[tempi++][tempj--] );
                }
                dir = true;
            }
        }

        for(int j = 1; j < mat.length; j++){
            
            if(dir){
                int tempi = mat.length-1;
                int tempj = j;
                
                while( tempj < mat.length && tempi >= 0){
                    ans.add( mat[tempi--][tempj++]);
                }
                
                dir = false;
            }else{
                int tempi = j;
                int tempj = mat.length-1;

                while( tempi < mat.length && tempj >= 0){
                    ans.add( mat[tempi++][tempj--]);
                }
                
                dir = true;
            }
        }

        for(int i : ans){
            System.out.println(i);
        }
    }
}
