require.config({
    baseUrl : "./lib",
    paths : {
        linkCollection : "app/linkCollection",
        linkView : "app/linkView",
        linkCollectionView : "app/linkCollectionView"
    }
});

require(["jquery", "json2", "underscore", "backbone", "app/app"], function() {

});
