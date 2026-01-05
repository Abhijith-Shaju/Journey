public class OnetoN {
    
    public static void main(String[] args) {
        print(10, 2);
    }

    public static void print(int n, int i){
        if(i>n)return;
        System.out.println(i);

        print(n, i+1);
    }
}
