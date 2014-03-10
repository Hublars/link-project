define(["linkView", "jquery", "json2", "underscore", "backbone"], function(LinkView) {
    
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
                this.listenTo(item, "moreButton", function(msg) { this.moreButtonClicked(msg);});
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
        },
    });
    
    return LinkCollectionView;
});