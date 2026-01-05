public class ReverseNumber {
    public static void main(String[] args) {
        sum(1234);
        System.out.println(ans );
    }

    static int ans = 0;
    public static void sum(int n){

        if(n == 0)return;

        ans = (ans*10) + n%10; 

        sum(n/10);
    }
}
