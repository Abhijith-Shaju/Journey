package twoPointers;

import java.util.Scanner;

public class CodeChefYourNameIsMine {
    	public static void main (String[] args) throws java.lang.Exception
	{
		// your code goes here
		Scanner sc = new Scanner(System.in);
		
		int test = sc.nextInt();
		sc.nextLine();
		while(test > 0){
		    
		    String str = sc.nextLine();
		    
		    String[] arr = str.split(" ");
		    
		    int z = Math.min(arr[0].length(), arr[1].length());

            int i = 0, j = 0;
            
            while(i < arr[0].length() && j < arr[1].length()){
                if(arr[0].charAt(i) == arr[1].charAt(j)){
                    i++;
                    j++;
                    z--;
                }else{
                    if(arr[0].length() > arr[1].length())i++;
                    else j++;
                }
            }
            
            String ans = (z == 0) ? "YES" : "NO";
		    System.out.println(ans);
		    
		    test--;
		}

        sc.close();

	}
}
