public class binarySearch {
    public static int binary(int[] arr, int start, int end, int target){
        if(start > end){
            return -1;
        }
        int mid = start + (end - start) / 2;

        if(arr[mid] == target){
            return mid;
        }
        else if(arr[mid] < target){
            return binary(arr, mid+1, end, target);
        }else{
            return binary(arr, start, mid-1, target);
        }
    }
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9};
        System.out.println(binary(arr, 0, arr.length-1, 6));
    }
}
