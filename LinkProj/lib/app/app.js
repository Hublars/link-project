define(["linkCollection", "linkCollectionView", "jquery", "json2", "underscore", "backbone"], function(LinkCollection, LinkCollectionView) {

    var LinkModel = Backbone.Model.extend({
        defaults : {
            photo : "assets/images/placeholder.png",
            collId : 0,
            countId : 0,
            openedWithCountId : 0,
            buttonLabel : "More"
        },

        initialize : function() {
            this.on("moreButton", function(msg) {

                var addOrRemove = msg[0];

                if (addOrRemove === "add") {
                    addChildren(this, msg[1]);
                } else if (addOrRemove === "remove") {
                    removeChildren(this, msg[1]);
                }
                
                linkRouter.doNavigate();
            });
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
        }
    });
    
    var LinkRouter = Backbone.Router.extend({
        routes : {
            "*nav" : "browserWalk",
            "" : "index"
        },

        browserWalk : function(more) {

            $("#linksDiv").html("");

            mainLinks = new LinkCollectionView({
                el : $(getNewLinkDiv()),
                collection : new Directory(LinkCollection.pageLinks),
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

    function removeChildren(model, nm) {

        var startCount = model.get("collId") + 1;
        var lastCount = allCollections.length;

        var testStr = "";

        for (var i = startCount; i < lastCount; i++) {

            var subColl = allCollections[i];

            for (var j = subColl.collection.models.length - 1; j > -1; j--) {

                var modelName = subColl.collection.models[j].get("name");
                var modelOpenedWithCountId = subColl.collection.models[j].get("openedWithCountId");

                if (modelName === nm && modelOpenedWithCountId === model.get("countId")) {
                    subColl.collection.models[j].destroy();
                }

                subColl.render();
            }
        }

        model.set("buttonLabel", "More");
    }
    
    function getNewLinkDiv() {
        var linkDiv = document.createElement("DIV");
        linkDiv.className = "linkCollection";
        $("#linksDiv").append(linkDiv);

        return linkDiv;
    }

    var mainLinks = new LinkCollectionView({
        el : $(getNewLinkDiv()),
        collection : new Directory(LinkCollection.pageLinks)
    });
    mainLinks.setCollectionNumber(0);
    mainLinks.initialize();
    mainLinks.render();
    var allCollections = [mainLinks];

    var linkRouter = new LinkRouter();
    Backbone.history.start({
        pushState : false,
        root : "/LinkProj/index.html#",
    });

    var myView = new MyWidget();
    myView.render();
});

