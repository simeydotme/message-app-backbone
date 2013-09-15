
(function() {

  // we will load all the scripts from here.

  var j = "js/";
  var v = j+"vendor/";
  var h = j+"helpers/";
  var a = j+"app/";

  Modernizr.load({
      
    test: Modernizr.borderradius,

    // jquery; we check for borderradius (which IE8 or less doesn't support)
    // and load either the lightweight 2.0 or 1.9.
    yep : v+"jquery2.js",
    nope: v+"jquery.js",

    complete: function() {
      Modernizr.load({

        test: window.JSON ,

        // JSON; we should load JSON2 if we don't have json!
        nope: v+"json2.js",

        complete: function() {
          Modernizr.load({

            // files we want to load always.
            load: [ v+"underscore.js", v+"backbone.js", v+"handlebars.js", v+"bootstrap.js" ],

            complete: function() {
              Modernizr.load({

                load: [ h+"console.js", h+"fonts.js", h+"handlers.helpers.js", j+"main.js", a+"app.js" ]

              });
            }

          });
        }

      });
    }

  });

})();
