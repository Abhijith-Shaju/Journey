
class Node{
    int data;
    Node left, right;

    Node(int data){
        this.data = data;
        left = right = null;
    }
}

public class trees {
    public static void preOrder(Node root){
        if(root == null) return;
        System.out.print(root.data + " ");
        preOrder(root.left);
        preOrder(root.right);
    }

    public static void inOrder(Node root){
        if(root == null) return;
        inOrder(root.left);
        System.out.print(root.data + " ");
        inOrder(root.right);
    }


    public static void postOrder(Node root){
        if(root == null) return;
        postOrder(root.left);
        postOrder(root.right);
        System.out.print(root.data + " ");
    }

    public static void main(String[] args) {
        // level 1 
        Node root = new Node(1);

        //level 2
        Node l2_1 = root.left = new Node(2);
        Node l2_2 = root.right = new Node(3);

        //level 3
        Node l3_1 = l2_1.left = new Node(4);
        Node l3_2 = l2_1.right = new Node(5);

        Node l3_3 = l2_2.left = new Node(6);
        Node l3_4 = l2_2.right = new Node(7);

        // level 4
        Node l4_1 = l3_1.left = new Node(8);
        Node l4_2 = l3_1.right = new Node(9);

        Node l4_3 = l3_2.left = new Node(10);
        Node l4_4 = l3_2.right = new Node(11);
        
        Node l4_5 = l3_3.left = new Node(12);

        System.out.print("In-Order Traversal    (left - root - right) : ");
        inOrder(root);
        System.out.println();

        System.out.print("Pre-Order Traversal   (root - left - right) : ");
        preOrder(root);
        System.out.println();

        System.out.print("Post-Order Traversal  (left - right - root) : ");
        postOrder(root);
    }
}
