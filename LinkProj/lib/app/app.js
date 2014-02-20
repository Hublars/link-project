define(["linkCollection", "jquery", "json2", "underscore", "backbone"], function(lc) {

	var LinkModel = Backbone.Model.extend({
		defaults : {
			photo : "assets/images/placeholder.png",
			numId : 0
		}
	});

	var Directory = Backbone.Collection.extend({
		model : LinkModel,

		setHeader : function(header) {
			var that = this;

			_.each(this.models, function(item) {
				item.set("name", header);
			}, this);
		},

		setCollectionNumber : function(newCollectionNumber) {
			var that = this;

			_.each(this.models, function(item) {
				item.set("numId", newCollectionNumber);
			}, this);
		},
	});

	var LinkView = Backbone.View.extend({
		tagName : "article",
		className : "link-container",
		template : $("#linkTemplate").html(),

		initialize : function() {
		    
		},

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
			var nm = this.model.get("name");

			if (btnTxt === "More") {

				var nextCollectionNumber = this.model.get("numId") + 1;

				if (allCollections[nextCollectionNumber]) {

					var existingCollectionView = allCollections[nextCollectionNumber];

					var linksNew = new Directory(this.model.get("links"));
					linksNew.setHeader(nm);
					linksNew.setCollectionNumber(nextCollectionNumber);

					existingCollectionView.collection.add(linksNew.toJSON(), {
						silent : true
					});

					existingCollectionView.render();

				} else {
					var linksNew = new Directory(this.model.get("links"));
					linksNew.setHeader(nm);

					var subLinks = new LinkCollectionView({
						el : $(getNewLinkDiv()),
						collection : new Directory()
					});

					subLinks.collection.add(linksNew.toJSON(), {
						silent : true
					});

					subLinks.setCollectionNumber(nextCollectionNumber);
					subLinks.doInitialize();
					subLinks.render();

					allCollections.push(subLinks);
				}

				$(e.target).html("Less");
				
				linkRouter.navigate("#nav" + navNum++, { trigger: true });

			} else if (btnTxt === "Less") {

				var startCount = this.model.get("numId") + 1;
				var lastCount = allCollections.length;

				var testStr = "";
				
				for (var i = startCount; i < lastCount; i++) {
					
					var subColl = allCollections[i];
					
					for (var j = subColl.collection.models.length - 1; j > -1; j--) {
						
						var modelName = subColl.collection.models[j].get("name");
						
						if (modelName === nm) {
							subColl.collection.models[j].destroy();
						}
						
						subColl.render();
					}
				}
				
				$(e.target).html("More");
				
				linkRouter.navigate("#nav" + navNum++, { trigger: true });
			}
		}
	});

	var LinkCollectionView = Backbone.View.extend({
		collectionNumber : 0,

		setCollectionNumber : function(newCollectionNumber) {
			this.collectionNumber = newCollectionNumber;
		},

		getCollectionNumber : function() {
			return this.collectionNumber;
		},

		initialize : function() {
		},

		doInitialize : function() {
			_.each(this.collection.models, function(item) {
				item.set("numId", this.getCollectionNumber());
			}, this);

			this.render();
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
		$("body").append(linkDiv);

		return linkDiv;
	}

	var mainLinks = new LinkCollectionView({
		el : $(getNewLinkDiv()),
		collection : new Directory(lc.pageLinks),
	});
	mainLinks.setCollectionNumber(0);
	mainLinks.doInitialize();

	var allCollections = [mainLinks];
	
	
	var navNum = 0;
	
	var LinkRouter = Backbone.Router.extend({
		routes: {
			"*nav": "showMoreOrLess",
			"": "index"
		},
		
		showMoreOrLess: function(more) {
			//this.navigate("#");
			//console.log(more);
		},
		
		index: function() {
			console.log("index");
		}
	});
	
	var linkRouter = new LinkRouter();
	
	Backbone.history.start();
});











