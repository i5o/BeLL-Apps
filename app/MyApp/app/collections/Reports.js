$(function() {

  // We're getting _all_docs instead of a Resources view because we're not putting
  // views in Collection databases. We'll mapreduce client side.
  App.Collections.Reports = Backbone.Collection.extend({

    model: App.Models.CommunityReport,

    url: function() {
      return App.Server + '/communityreports/_design/bell/_view/allCommunityReports?include_docs=true'
    },

    parse: function(response) {
      var models = []
      _.each(response.rows, function(row) {
        models.push(row.doc)
      });
      return models
    },


  })

})