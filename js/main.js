
$(function() {

  $.ajaxSetup({ cache: false });

  console.log( "  [ { $: " + $.fn.jquery + 
    " }, { _: " + _.VERSION + 
    " }, { Backbone: " + Backbone.VERSION + 
    " }, { Handlebars: " + Handlebars.VERSION + 
    " }, { Bootstrap" +
    " } ]" );
  console.log( "===================================" );

});

