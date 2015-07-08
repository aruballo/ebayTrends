var ebayTrends = ebayTrends || {};

ebayTrends.utils ={
    calculateAverage: function(data){

        
        var sum = 0;
        var total = data.length;
       
        if(total == 0){
            return 0;
        }
        else{
            for(var i = 0; i < data.length; i++){
                sum += parseFloat(data[i]);
            }
            return sum/total;
        }
    },
    
    calculateMedian: function(data2){
        //Deep copy data2
        var data = [];
        for(var i = 0; i < data2.length; i++){
            data.push(parseFloat(data2[i]));
        }
        
        data.sort( 
            function(a,b){
                return parseFloat(a) - parseFloat(b);
            }
        );
 
        var half = Math.floor(data.length/2);
 
        if(data.length % 2){
            return data[half];
        }
        else{
            return (data[half-1] + data[half]) / 2.0;
        }
    },
    
    calculateMode: function(data){
        if(data.length == 0){
            return null;
        }
        
        var modeMap = {};
        var maxEl = data[0];
        var maxCount = 1;
        
        for(var i = 0; i < data.length; i++) {
            var el = data[i];
            if(modeMap[el] == null){
                modeMap[el] = 1;
            }
            else{
                modeMap[el]++;	
            }
            if(modeMap[el] > maxCount){
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return parseFloat(maxEl);
    }
};