var ebayTrends = ebayTrends || {};

ebayTrends.model = Backbone.Model.extend({});

ebayTrends.searchCollection = Backbone.Collection.extend({
    
    model: ebayTrends.model,
    
    url: 'http://svcs.ebay.com/services/search/FindingService/v1',
    
    parse: function(data){
        return data.findItemsByKeywordsResponse[0].searchResult[0].item;
    }
    
});

ebayTrends.graphCollection = Backbone.Collection.extend({
    
    model: ebayTrends.model,
    
    url: 'http://svcs.ebay.com/services/search/FindingService/v1',
    
    parse: function(data){
        return data.findCompletedItemsResponse[0].searchResult[0].item;
    }
    
});