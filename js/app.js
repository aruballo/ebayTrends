//Main javascript file for Ebay Trends app
var ebayTrends = ebayTrends || {};

//Main View
ebayTrends.searchView = Backbone.View.extend({
    template: _.template($('#mainDiv').html()),
    
    tagName: 'div',
    
    events:{
      "click #searchButton"      : "getResults"
    },
    
    render: function(){
            this.$el.empty();
            this.$el.html(this.template());
            $('body').append(this.$el);
            return this;
    },
    
    getResults: function(operation){
        var searchValue = document.getElementById("searchValue").value;
        var parameters = 'SECURITY-APPNAME=AntonioR-c20d-4f92-aad4-791bfb005d8c&' +
            'OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON' +
            '&REST-PAYLOAD&keywords=' + searchValue;
        this.currentCollection = new ebayTrends.collection();
        this.currentCollection.fetch({dataType: 'jsonp', data: parameters, success: (function(context){
            return function(){
                context.createTable();
            };
        })(this)});
      
    },
    
    createTable: function(){
        this.render();
        var currentResults = new ebayTrends.tableView({
            collection: this.currentCollection
        });
        var $table = currentResults.render().$el;
        this.$el.append($table);
    }
});

//View for table row
ebayTrends.tableRowView = Backbone.View.extend({
    template: _.template($('#resultsRow').html()),
    render: function(eventName){
        var html = this.template(this.model.toJSON());
        this.setElement($(html));
        return this;
    }
});

//View for table
ebayTrends.tableView = Backbone.View.extend({
    tagName: 'table',
    initialize: function(){
        this.collection.bind("reset", this.render, this);
    },
    render: function(eventName){
        this.$el.empty();
        var tableHeader =   
              "<thead>                  " +
              "  <tr>                   " +
              "    <th>Title      </th> " +
              "    <th>Condition  </th> " +
              "    <th>Price</th>       " +
              "    <th>Shipping   </th> " +
              "  </tr>                  " +
              "</thead>                 ";
        
        this.$el.append(tableHeader);
        
        this.collection.each(function(result){
            var row = new ebayTrends.tableRowView({model: result});
            var $tr = row.render().$el;
            this.$el.append($tr);
        }, this);
        
        return this;
    }
    
});


ebayTrends.mainView = new ebayTrends.searchView();
ebayTrends.mainView.render();