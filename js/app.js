//Main javascript file for Ebay Trends app
var ebayTrends = ebayTrends || {};

ebayTrends.searchView = Backbone.View.extend({
    el: document.getElementById("mainDiv"),
    
    events:{
      "click #searchButton"      : "getResults"
    },
    
    getResults: function(){
        
        var searchValue = document.getElementById("searchValue").value;
        var parameters = 'SECURITY-APPNAME=AntonioR-c20d-4f92-aad4-791bfb005d8c&' +
            'OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON' +
            '&REST-PAYLOAD&keywords=' + searchValue;
        ebayTrends.currentCollection = new ebayTrends.collection();
        ebayTrends.currentCollection.fetch({dataType: 'jsonp', data: parameters});
    }
});


ebayTrends.mainView = new ebayTrends.searchView();