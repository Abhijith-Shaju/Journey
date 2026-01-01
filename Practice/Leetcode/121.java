class Solution {
    public int maxProfit(int[] prices) {
        int l = 0, r = 1;
        int maxP = 0;

        while(r < prices.length){
            if( prices[l] < prices[r] ){
                maxP = Math.max(maxP, prices[r] - prices[l]);
            }else{
                l = r;
            }
            r++;
        }
        return maxP;
    }
} 