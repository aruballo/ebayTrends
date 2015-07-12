var ebayTrends = ebayTrends || {};

ebayTrends.model = Backbone.Model.extend({});

//Collection for a search query
ebayTrends.searchCollection = Backbone.Collection.extend({
    
    model: ebayTrends.model,
    
    url: 'http://svcs.ebay.com/services/search/FindingService/v1',
    
    parse: function(data){
        return data.findItemsByKeywordsResponse[0].searchResult[0].item;
    }
    
});

//Collection for a graph query
ebayTrends.graphCollection = Backbone.Collection.extend({
    
    model: ebayTrends.model,
    
    url: 'http://svcs.ebay.com/services/search/FindingService/v1',
    
    parse: function(data){
        return data.findCompletedItemsResponse[0].searchResult[0].item;
    }
    
});