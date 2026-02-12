class Node{
    int data;
    Node left, right;

    Node(int data){
        this.data = data;
        left = right = null;
    }
}

public class countNodes {

    static int height(Node root){
        if(root == null) return 0;
        int h = 0;
        while(root.left != null){
            h++;
            root = root.left;
        }

        return h;
    }
    
    //Brute Force!!!!!!
    // static int count(Node root){
    //     if(root == null) return 0;
    //     return count(root.left) + count(root.right) + 1;
    // }

    static int count(Node root){
        int count = 0;
        int height = height(root);

        while(root != null){
            if(height(root.right) == height-1){
                count += 1 << height;
                root = root.right;
            }else{
                count += 1 << height - 1;
                root = root.left;
            }

            height--;
        }
        return count;

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

        System.out.println(count(root));

        System.out.println(height(root));
    }
}
