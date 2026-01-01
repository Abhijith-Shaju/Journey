import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int l = 0, r = 0, maxL = 0;
        HashSet<Character> set = new HashSet<>();

        if(s.length() == 1) return 1;

        while(r < s.length()){
            
            if( !set.contains( s.charAt(r) ) ){
                set.add( s.charAt(r++) );
            }else{
                set.remove( s.charAt(l++) );
            }

            maxL = Math.max(maxL, r-l);
        }
        return maxL;
    }
}