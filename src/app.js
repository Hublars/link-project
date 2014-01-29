( function($) {

        var pageLinks = [{
            name : "jQuery",
            address : "http://jquery.com/",
            type : "",
            description: ""
        }, {
            name : "Underscore",
            address : "http://underscorejs.org/",
            type : "",
            description: ""
        }, {
            name : "Backbone",
            address : "http://backbonejs.org/",
            type : "",
            description: ""
        }, {
            name : "JSON",
            address : "https://github.com/douglascrockford/JSON-js",
            type : "",
            description: ""
        }, {
            name : "Testing Testing Testing Testing Testing",
            address : "https://github.com/douglascrockford/JSON-js",
            type : "",
            description: ""
        }];

        var jQueryLinks = [{
            name : "",
            address : "http://jqueryui.com/",
            type : "library",
            description: "jQuery UI"
        }, {
            name : "",
            address : "http://api.jquery.com/",
            type : "api",
            description: "jQuery API"
        }];
        
        var underscoreLinks = [{
            name : "",
            address : "http://underscorejs.org/docs/underscore.html",
            type : "api",
            description: "Annotated source code"
        }, {
            name : "",
            address : "https://github.com/jashkenas/underscore/",
            type : "source",
            description: "Underscore on GitHub"
        }];
        
        var backboneLinks = [{
            name : "",
            address : "http://net.tutsplus.com/sessions/build-a-contacts-manager-using-backbone-js/",
            type : "tutorial",
            description: "Tutorial. Somewhat faulty"
        }, {
            name : "",
            address : "https://github.com/jashkenas/backbone/",
            type : "source",
            description: "Backbone on GitHub"
            }, {
            name : "",
            address : "https://github.com/jashkenas/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites",
            type : "tutorial",
            description: "Tutorials m.m."
            }, {
            name : "",
            address : "https://github.com/addyosmani/backbone-fundamentals/blob/gh-pages/index.md",
            type : "tutorial",
            description: "En hel bok om Backbone på GitHub"
        }];
        
        var jsonLinks = [{
            name : "",
            address : "http://www.w3schools.com/json/default.asp",
            type : "tutorial",
            description: "Tutorial on w3schools"
        }, {
            name : "",
            address : "http://stackoverflow.com/questions/552135/difference-between-json-js-and-json2-js",
            type : "QandA",
            description: "Difference between json.js and json2.js"
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

            showMore : function() {

                var nm = this.model.get("name");

                if (nm === "jQuery") {
                    subLinks.collection = new Directory(jQueryLinks);
                }
                else if (nm === "Underscore") {
                    subLinks.collection = new Directory(underscoreLinks);
                }
                else if (nm === "Backbone") {
                    subLinks.collection = new Directory(backboneLinks);
                }
                else if (nm === "JSON") {
                    subLinks.collection = new Directory(jsonLinks);
                }
                
                subLinks.setHeader(nm);
                    subLinks.render();
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
            
            setHeader: function(header) {
                var that = this;
                
                _.each(this.collection.models, function(item) {
                    item.set("name", header);
                }, this);
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

        var mainLinks = new MainLinkView();

        var subLinks = new SubLinkView();

    }(jQuery));

