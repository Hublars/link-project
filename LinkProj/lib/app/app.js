define(["linkCollection", "jquery", "json2", "underscore", "backbone"], function(lc) {

    var LinkModel = Backbone.Model.extend({
        defaults : {
            photo : "assets/images/placeholder.png",
            collId : 0,
            countId : 0,
            openedWithCountId : 0,
            buttonLabel : "More"
        }
    });

    var Directory = Backbone.Collection.extend({
        model : LinkModel,

        setHeader : function(header) {
            var that = this;
            var nm = header.split("-")[0];

            _.each(this.models, function(item) {
                item.set("name", nm);
            }, this);
        },

        setCollectionNumber : function(newCollectionNumber) {
            var that = this;

            _.each(this.models, function(item) {
                item.set("collId", newCollectionNumber);
            }, this);
        },
    });

    var LinkView = Backbone.View.extend({
        tagName : "article",
        className : "link-container",
        template : _.template($("#linkTemplate").html()),

        initialize : function() {
            this.listenTo(this.model, "change:buttonLabel", this.renderButton);
        },

        render : function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        renderButton : function() {
            $(".showMore", this.$el).html(this.model.get("buttonLabel"));
            return this;
        },

        events : {
            "click button.showMore" : "showMore"
        },

        showMore : function(e) {
            var btnTxt = this.model.get("buttonLabel");
            var nm = this.model.get("name");
            var countId = this.model.get("countId");

            if (btnTxt === "More") {
                addChildren(this.model, nm);
                linkRouter.doNavigate();

            } else if (btnTxt === "Less") {

                var startCount = this.model.get("collId") + 1;
                var lastCount = allCollections.length;

                var testStr = "";

                for (var i = startCount; i < lastCount; i++) {

                    var subColl = allCollections[i];

                    for (var j = subColl.collection.models.length - 1; j > -1; j--) {

                        var modelName = subColl.collection.models[j].get("name");
                        var modelOpenedWithCountId = subColl.collection.models[j].get("openedWithCountId");

                        if (modelName === nm && modelOpenedWithCountId === countId) {
                            subColl.collection.models[j].destroy();
                        }

                        subColl.render();
                    }
                }

                this.model.set("buttonLabel", "More");

                linkRouter.doNavigate();
            }
        }
    });

    var LinkCollectionView = Backbone.View.extend({
        _collectionNumber : 0,

        setCollectionNumber : function(newCollectionNumber) {
            this.collectionNumber = newCollectionNumber;
        },

        getCollectionNumber : function() {
            return this.collectionNumber;
        },

        initialize : function() {
            _.each(this.collection.models, function(item) {
                item.set("collId", this.getCollectionNumber());
            }, this);
        },

        render : function() {
            this.$el.html("");
            var that = this;
            _.each(this.collection.models, function(item) {
                that.renderLink(item);
            }, this);
        },

        renderLink : function(item) {
            var linkView = new LinkView({
                model : item
            });
            this.$el.append(linkView.render().el);
        }
    });

    function getNewLinkDiv() {
        var linkDiv = document.createElement("DIV");
        linkDiv.className = "linkCollection";
        $("#linksDiv").append(linkDiv);

        return linkDiv;
    }

    var mainLinks = new LinkCollectionView({
        el : $(getNewLinkDiv()),
        collection : new Directory(lc.pageLinks),
    });

    mainLinks.setCollectionNumber(0);
    mainLinks.initialize();
    mainLinks.render();

    var allCollections = [mainLinks];

    var LinkRouter = Backbone.Router.extend({
        routes : {
            "*nav" : "browserWalk",
            "" : "index"
        },

        browserWalk : function(more) {
            //console.log(more);

            $("#linksDiv").html("");

            mainLinks = new LinkCollectionView({
                el : $(getNewLinkDiv()),
                collection : new Directory(lc.pageLinks),
            });
            mainLinks.setCollectionNumber(0);
            mainLinks.initialize();

            allCollections = [mainLinks];

            mainLinks.render();

            if (more) {
                if (more.indexOf("*") < 0)
                    return;

                var listHeaders = more.split("*");
            } else {
                return;
            }

            for (var i = 0; i < allCollections.length; i++) {

                if (listHeaders.length > 1) {
                    var subHeaders = listHeaders[i + 1].split(",");
                } else {
                    return;
                }
                _.each(subHeaders, function(header) {
                    _.each(allCollections[i].collection.models, function(model) {

                        var compareHeader = header.split("-")[0];
                        var compareId = header.split("-")[1];

                        if (model.get("name") === compareHeader && parseInt(model.get("countId")) === parseInt(compareId)) {
                            addChildren(model, header);
                        }
                    });
                });
            }
        },

        index : function() {
            console.log("index");
        },

        doNavigate : function() {
            var allHeaders = "";
            var subCollHeaders = "";

            for (var i = 0; i < allCollections.length; i++) {

                var subColl = allCollections[i];

                for (var j = 0; j < subColl.collection.models.length; j++) {

                    var modl = subColl.collection.models[j];
                    var modelHeader = modl.get("name") + "-" + modl.get("openedWithCountId");

                    if (subCollHeaders.indexOf(modelHeader) < 0)
                        subCollHeaders += modelHeader + ",";
                }

                if (subCollHeaders !== "*")
                    allHeaders += subCollHeaders;

                subCollHeaders = "*";
            }

            this.navigate(allHeaders, {
                trigger : false
            });
        }
    });

    var linkRouter = new LinkRouter();

    Backbone.history.start({
        pushState : false,
        root : "/LinkProj/index.html#",
    });

    function addChildren(model, nm) {

        if (model.get("links").length > 0) {

            model.set("buttonLabel", "Less");
        } else {
            return;
        }

        var nextCollectionNumber = model.get("collId") + 1;
        var countId = model.get("countId");

        if (allCollections[nextCollectionNumber]) {

            var existingCollectionView = allCollections[nextCollectionNumber];

            var linksNew = new Directory(model.get("links"));
            linksNew.setHeader(nm);
            linksNew.setCollectionNumber(nextCollectionNumber);

            var count = 0;
            _.each(linksNew.models, function(item) {
                item.set("countId", count++);
                item.set("openedWithCountId", model.get("countId"));
            });

            existingCollectionView.collection.add(linksNew.toJSON(), {
                silent : true
            });

            existingCollectionView.render();

        } else {
            var linksNew = new Directory(model.get("links"));
            linksNew.setHeader(nm);

            var count = 0;
            _.each(linksNew.models, function(item) {
                item.set("countId", count++);
                item.set("openedWithCountId", model.get("countId"));
            });

            var subLinks = new LinkCollectionView({
                el : $(getNewLinkDiv()),
                collection : new Directory()
            });

            subLinks.collection.add(linksNew.toJSON(), {
                silent : true
            });

            subLinks.setCollectionNumber(nextCollectionNumber);
            subLinks.initialize();
            subLinks.render();

            allCollections.push(subLinks);
        }
    }

});

