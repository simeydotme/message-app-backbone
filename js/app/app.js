
(function() {


  // set up the global object for message app.

  window.msg = {

    views: {},
    models: {},
    collections: {},
    elements: {
      container: {
        single: $(".msg-message .msg-inner"),
        list: $(".msg-messages .msg-inner")
      }
    },

    buildTemplate: function( template ) {

      return function( modelData ) {
        if(!modelData) { 
          console.warn("Just tried to create bad template"); 
        } else {
          var exchange = Handlebars.compile( template );
          return exchange(modelData);
        }
      }

    },

    templates: {}
  
  };


  var vent = _.extend({}, Backbone.Events);


  // routes
  msg.router = Backbone.Router.extend({

    routes: {
      "message/:id" : "showMessage"
    },
    showMessage: function(id) {
      vent.trigger("message:show",id)
    }

  });






  //models 

  // default model for a "message";

  msg.models.message = Backbone.Model.extend({
    defaults: {
      "to": "anon@ymous.com",
      "from": "incog@nito.com",
      "subject": "001011010010100101110",
      "date": "1/1/2999",
      "status": "new",
      "type": "",
      "message": "Mate, Happy Birthday. To celebrate this once a year occasion we have picked the following gift: %gift%. Enjoy."
    }
  });







  // collections

  msg.collections.messages = Backbone.Collection.extend({
    model: msg.models.message
  });







  // views

  // view for message-list (column2)

  msg.views.messageItem = Backbone.View.extend({
    
    tagName: "tr",
    
    template: function() {
      return msg.templates.messageItem(this.model.toJSON());
    },

    render: function() {
      this.$el.append( this.template() );
      this.$el.find("a").on("click",function(e){e.preventDefault();})
      return this;
    },
    
    initialize: function() {
      // this.render();
    },
    
    events: {
      "click th": "showMessage"
    },

    showMessage: function() {

      var id = this.model.toJSON().id;
      router.navigate("#message/"+id, true);
      
    }

  });

  msg.views.messageList = Backbone.View.extend({

    tagName: "tbody",
    render: function() {

      this.collection.each( function( messageModel ) {
        var thisMessage = new msg.views.messageItem({ model: messageModel });
        this.$el.append( thisMessage.render().$el );
      }, this );

      this.drawList();

      return this;

    },

    initialize: function() {
      // this.render();
    },

    drawList: function() {

      var $container = msg.elements.container.list;
      var $thead = $container.find("thead");
      $thead.next("tbody").remove();
      $thead.after( this.$el );

    }

  });



  // view for display-message (column3)

  msg.views.displayMessage = Backbone.View.extend({
    
    tagName: "div",

    template: function() {
      return msg.templates.message(this.model.toJSON());
    },

    render: function() {
      this.$el.html( this.template() );
      return this;
    },

    initialize: function() {
      vent.on("message:show", this.show, this);
    },

    show: function(id) {
      this.model = collection.findWhere({ id: id });
      var $container = msg.elements.container.single;
      $container.html( this.render().$el );
    }

  });







  // we start the app after templates are loaded.
  // templates not needed yet could be loaded as-and-when... perhaps.

  var folder = "js/app/templates/";
  var templates = {
    files: [
      $.get( folder + "message.item.tmpl" ) ,
      $.get( folder + "message.single.tmpl" )
    ],
    names: [
      "messageItem",
      "message"
    ]
  }

  var collection;
  var view;
  var message;
  var router;

  $.when.apply( $, templates.files )
    .then( function() {

      _.each( arguments , function( item , key ) {
        msg.templates[ templates.names[key] ] = msg.buildTemplate( item[0] );
      });

      StartApp();

    });

  function StartApp() {

    var getMessages = $.getJSON("js/app/data.json");

    getMessages.done( function( data ) {

      collection = new msg.collections.messages( data.data );
      view = new msg.views.messageList({ collection: collection });
      message = new msg.views.displayMessage;
      router = new msg.router();

      view.render();

      Backbone.history.start();

    });

  }



})();