( function($) {

        var pageLinks = [{
            "name" : "jQuery",
            "address" : "http://jquery.com/",
            "type" : "",
            "description" : "",
            "links" : [{
                "name" : "",
                "address" : "http://jqueryui.com/",
                "type" : "library",
                "description" : "jQuery UI",
                "links" : []
            }, {
                "name" : "",
                "address" : "http://api.jquery.com/",
                "type" : "api",
                "description" : "jQuery API",
                "links" : []
            }]
        }, {
            "name" : "Underscore",
            "address" : "http://underscorejs.org/",
            "type" : "",
            "description" : "",
            "links" : [{
                "name" : "",
                "address" : "http://underscorejs.org/docs/underscore.html",
                "type" : "api",
                "description" : "Annotated source code",
                "links" : []
            }, {
                "name" : "",
                "address" : "https://github.com/jashkenas/underscore/",
                "type" : "source",
                "description" : "Underscore on GitHub",
                "links" : []
            }]
        }, {
            "name" : "Backbone",
            "address" : "http://backbonejs.org/",
            "type" : "",
            "description" : "",
            "links" : [{
                "name" : "",
                "address" : "http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/",
                "type" : "tutorial",
                "description" : "Tutorial. Somewhat faulty",
                "links" : []
            }, {
                "name" : "",
                "address" : "https://github.com/jashkenas/backbone/",
                "type" : "source",
                "description" : "Backbone on GitHub",
                "links" : []
            }, {
                "name" : "",
                "address" : "https://github.com/jashkenas/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites",
                "type" : "tutorial",
                "description" : "Tutorials m.m.",
                "links" : []
            }, {
                "name" : "",
                "address" : "https://github.com/addyosmani/backbone-fundamentals/blob/gh-pages/index.md",
                "type" : "tutorial",
                "description" : "En hel bok om Backbone på GitHub",
                "links" : []
            }]
        }, {
            "name" : "JSON",
            "address" : "https://github.com/douglascrockford/JSON-js",
            "type" : "",
            "description" : "",
            "links" : [{
                "name" : "",
                "address" : "http://jsonlint.com/",
                "type" : "program",
                "description" : "JSONLint. Check code",
                "links" : []
            }, {
                "name" : "",
                "address" : "http://www.w3schools.com/json/default.asp",
                "type" : "tutorial",
                "description" : "Tutorial on w3schools",
                "links" : []
            }, {
                "name" : "",
                "address" : "http://stackoverflow.com/questions/552135/difference-between-json-js-and-json2-js",
                "type" : "QandA",
                "description" : "Difference between json.js and json2.js",
                "links" : []
            }]
        }, {
            "name" : "Testing Testing Testing Testing Testing",
            "address" : "https://github.com/douglascrockford/JSON-js",
            "type" : "",
            "description" : "",
            "links" : []
        }];

        var PageLink = Backbone.Model.extend({
            defaults : {
                photo : "assets/images/placeholder.png"
            }
        });

        var Directory = Backbone.Collection.extend({
            model : PageLink
        });

        var PageLinkView = Backbone.View.extend({
            tagName : "article",
            className : "link-container",
            template : $("#pageLinkTemplate").html(),

            render : function() {
                var tmpl = _.template(this.template);

                $(this.el).html(tmpl(this.model.toJSON()));
                return this;
            },

            events : {
                "click button.showMore" : "showMore"
            },

            showMore : function(e) {

                var btnTxt = $(e.target).html();

                if (btnTxt === "More") {
                    var nm = this.model.get("name");

                    var linksToAdd = new Directory(this.model.get("links"));
                    subLinks.collection.add(linksToAdd.toJSON(), {silent: true});

                    subLinks.setHeader(nm);
                    subLinks.render();

                    $(e.target).html("Less");

                } else if (btnTxt === "Less") {
                    subLinks.initialize();

                    $(e.target).html("More");
                }
            }
        });

        var MainLinkView = Backbone.View.extend({
            el : $("#mainLinks"),

            initialize : function() {
                this.collection = new Directory(pageLinks);
                this.render();
            },

            render : function() {
                var that = this;
                _.each(this.collection.models, function(item) {
                    that.renderLink(item);
                }, this);
            },

            renderLink : function(item) {
                var linkView = new PageLinkView({
                    model : item
                });
                this.$el.append(linkView.render().el);
            }
        });

        var SubLinkView = Backbone.View.extend({
            el : $("#subLinks"),

            initialize : function() {
                this.collection = new Directory();
                this.render();
            },

            setHeader : function(header) {
                var that = this;

                _.each(this.collection.models, function(item) {
                    item.set("name", header);
                }, this);
            },

            render : function() {
                $("#subLinks").html("");
                var that = this;
                _.each(this.collection.models, function(item) {
                    that.renderLink(item);
                }, this);
            },

            renderLink : function(item) {
                var linkView = new PageLinkView({
                    model : item
                });
                this.$el.append(linkView.render().el);
            }
        });

        var mainLinks = new MainLinkView();

        var subLinks = new SubLinkView();

    }(jQuery));

