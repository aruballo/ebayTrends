//Main javascript file for Ebay Trends app
var ebayTrends = ebayTrends || {};

//Main View
ebayTrends.searchView = Backbone.View.extend({
    template: _.template($('#mainDiv').html()),
    
    tagName: 'div',
    
    events:{
      "click #searchButton": 
      function(){
          if(document.getElementById('searchValue').value == ''){
              return;
          }
          this.operation = 'findItemsByKeywords';
          this.getResults();
      },
      "click #graphButton": 
      function(){
          if(document.getElementById('searchValue').value == ''){
              return;
          }
          this.operation = 'findCompletedItems';
          this.getResults();
      },
      "click #nextPage": 
      function(){
          this.pageNumber++;
          if(this.pageNumber > 100){
              this.pageNumber = 100;
              return;
          }
          this.getResults();
      },
      "click #previousPage": 
      function(){
          if(this.pageNumber <= 1){
              this.pageNumber = 1;
              return;
          }
          this.pageNumber--;
          this.getResults();
      }
    },
    
    render: function(){     
        if(!this.pageNumber){
            this.pageNumber = 1;
        }
        
        this.$el.empty();
        this.$el.html(this.template());
        $('body').append(this.$el);
        
        //bring back the previously used searchValue
        if(this.searchValue){
            document.getElementById("searchValue").value = this.searchValue;
        }
        return this;
    },
    
    getResults: function(){
        
        this.searchValue = document.getElementById("searchValue").value;
        
        //See eBay API for more details 
        var parameters = 'SECURITY-APPNAME=AntonioR-c20d-4f92-aad4-791bfb005d8c&' +
            'OPERATION-NAME=' + this.operation + '&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON' +
            '&REST-PAYLOAD&keywords=' + this.searchValue + '&paginationInput.pageNumber=' + this.pageNumber +
            '&&paginationInput.entriesPerPage=100';
        
        //Only show sold items since unsold item data is useless
        if(this.operation == "findCompletedItems"){
            parameters = parameters + "&itemFilter(0).name=SoldItemsOnly" +
                       + "&itemFilter(0).value=true";
            this.currentCollection = new ebayTrends.graphCollection();
        }
        else{
            this.currentCollection = new ebayTrends.searchCollection();
        }
        
        //Success function is a closure in order to preserve the current context 
        //when the function is called
        this.currentCollection.fetch({dataType: 'jsonp', data: parameters, success: (function(context){
            return function(){
                if(context.operation == "findItemsByKeywords"){
                    context.createTable();
                }
                else if(context.operation == "findCompletedItems"){
                    context.createGraph();
                }
                else{
                    return;
                }
            };
        })(this)});
      
    },
    
    createGraph: function(){
        this.render();
        var currentResults =  new ebayTrends.graphView({
            collection: this.currentCollection
        });
        var $graph = currentResults.render().$el;
        this.$el.append($graph);
        
    },
    
    createTable: function(){
        this.render();
        var currentResults = new ebayTrends.tableView({
            collection: this.currentCollection
        });
        var $table = currentResults.render().$el;
        this.$el.append($table);
        if(currentResults.collection.length < 100){
            if(this.pageNumber == 1){
                document.getElementById("previousPage").style.visibility = "hidden";  
            }
            document.getElementById("nextPage").style.visibility = "hidden";            
        }
        
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
    className: 'table-bordered table-hover',
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
//              "    <th>Shipping   </th> " +
              "  </tr>                  " +
              "</thead>                 ";
        
        this.$el.append(tableHeader);
        
        this.collection.each(function(result){
            var row = new ebayTrends.tableRowView({model: result});
            var $tr = row.render().$el;
            this.$el.append($tr);
        }, this);
        
        var pageButtons = 
              "<button type='button' id='previousPage'> Previous </button>" +
              "<button type='button' id='nextPage'> Next </button>        ";
              
              
        this.$el.append(pageButtons);      
        return this;
    }
    
});

//View for Chart.js graph
ebayTrends.graphView = Backbone.View.extend({
    template: _.template($('#graph').html()),
    render: function(){
        this.$el.empty();
        this.$el.html(this.template());
        $('body').append(this.$el);
        
        this.ctx = document.getElementById("itemTrendsGraph").getContext("2d");
        this.ctx.canvas.width = 1000;
        this.ctx.canvas.height = 500;
        
        //create array of values to chart
        var values = [];
        var labels = [];
        var collectionJSON = this.collection.toJSON();
        
        for(var i = 0; i < collectionJSON.length; i++){
            values.push(collectionJSON[i].sellingStatus[0].currentPrice[0].__value__);
            labels.push(i+1);
        }
        
        var data = {
            labels: labels,
            datasets: [{
               label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: values
            }]
        };
        
        var averagePrice = ebayTrends.utils.calculateAverage(values);
        var medianPrice = ebayTrends.utils.calculateMedian(values);
        var modePrice = ebayTrends.utils.calculateMode(values);
        
        document.getElementById("avgPrice").innerHTML = "$" + averagePrice.toFixed(2);
        document.getElementById("medianPrice").innerHTML = "$" + medianPrice.toFixed(2);
        document.getElementById("modePrice").innerHTML = "$" + modePrice.toFixed(2);
        
        var options = {
            bezierCurve : false           
        };

        this.chart = new Chart(this.ctx).Line(data, options);
        return this;
    },
});


ebayTrends.mainView = new ebayTrends.searchView();
ebayTrends.mainView.render();