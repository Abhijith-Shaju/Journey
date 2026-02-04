package Task.patterns;

import java.util.ArrayList;

public class one {
    public static void main(String[] args) {
        int[] arr = {7, 2, 1, 4, 3, 2, 2, 2, 2, 5, 1, 8, 2};
        
        ArrayList<Integer> ans = new ArrayList<>(); 
        ArrayList<Integer> index = new ArrayList<>(); 
        ArrayList<Integer> indexDiff = new ArrayList<>(); 
        
        for(int i = 0; i < arr.length-1; i++){
            boolean flag = false;
            for(int j = i+1; j < arr.length; j++){
                if(arr[i] < arr[j]){
                    ans.add(arr[j]);
                    index.add(j);
                    indexDiff.add(j-i);
                    flag = true;
                    break;
                }
            }
            if(!flag){
                ans.add(-1);
                index.add(-1);
                indexDiff.add(-1);
            }
        }
        ans.add(-1);
        index.add(-1);
        indexDiff.add(-1);

        System.out.println(ans.toString());
        System.out.println(index.toString());
        System.out.println(indexDiff.toString());


    }    
}
