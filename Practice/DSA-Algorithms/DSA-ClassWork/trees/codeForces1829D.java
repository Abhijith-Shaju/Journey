import java.util.Scanner;


public class codeForces1829D {
    static class Node{
        int data;
        Node left, right;
        
        Node(int data){
            this.data = data;
            left = right = null;
        }
    }
    static boolean check(Node root, int target){
        if(root.data == target) return true;

        if(root.data < 3  || root.data % 3 != 0) return false;

        root.left = new Node(root.data / 3);
        root.right = new Node( 2*(root.data / 3) );
        return check(root.left, target) || check(root.right, target);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int inputs = sc.nextInt();

        while(inputs-- > 0){
            int num = sc.nextInt();
            int target = sc.nextInt();

            Node root = new Node(num);
            boolean ans = check(root, target);
            
            if(ans) System.out.println("YES");
            else System.out.println("NO");
        }

        sc.close();
    }
}
