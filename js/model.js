var ebayTrends = ebayTrends || {};

ebayTrends.model = Backbone.Model.extend({});

ebayTrends.collection = Backbone.Collection.extend({
    
    model: ebayTrends.model,
    
    url: 'http://svcs.ebay.com/services/search/FindingService/v1'
    
});