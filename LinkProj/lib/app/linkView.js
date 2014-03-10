define(["jquery", "json2", "underscore", "backbone"], function() {
    
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
                
                this.model.trigger("moreButton", ["add", nm]);

            } else if (btnTxt === "Less") {
                
                this.model.trigger("moreButton", ["remove", nm]);
            }
        }
    });
    
    return LinkView;
});