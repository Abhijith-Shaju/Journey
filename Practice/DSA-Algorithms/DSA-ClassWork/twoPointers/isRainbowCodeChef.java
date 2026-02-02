package twoPointers;

import java.util.ArrayList;
import java.util.Scanner;

public class isRainbowCodeChef {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int test = sc.nextInt();

        while (test > 0) {
            int num = sc.nextInt();
            int[] arr = new int[num];
            ArrayList < Integer > list = new ArrayList < > ();


            int xor = 0;

            for (int i = 0; i < num; i++) {
                arr[i] = sc.nextInt();

                if (!list.contains(arr[i])) {
                    list.add(arr[i]);
                }

                xor ^= arr[i];
            }

            String ans = "yes";
            
            int mid = num / 2;
            int i = 0, j = num - 1;

            if (arr[mid] != 7) {
                ans = "no";
            } else {
                int x = 1;
                for (int y: list) {
                    if (x != y) ans = "no";
                    x++;
                }
                if (ans == "yes") {
                    while (i < j) {
                        if (arr[i] == arr[j] && (arr[i] <= arr[i + 1] && arr[j - 1] >= arr[j])) {
                            i++;
                            j--;
                            continue;
                        } else {
                            ans = "no";
                            break;
                        }
                    }
                }
            }
            
            System.out.println(ans);
            test--;
        }
        sc.close();
    }
}
