package twoPointers;

public class something {
    public static String reverseWords(String s) {
        String[] arr = s.split("\\s+");

        String sb = "";
        for(int i = arr.length-1; i >= 0; i--){
            sb = sb + arr[i] + " ";
        }

        return sb.trim();
    }
    public static void main(String[] args) {
        String s = "  hello World  ";
        System.out.println(reverseWords(s));
    }
}
