$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                if (confirm('Are you sure you want to delete this Report?')) {
                    this.model.destroy()
                    event.preventDefault();
                    alert(App.languageDict.attributes.Reports_Deleted_Success);}
            },
            "click #open": function(event) {
                if (this.model.get("views") == undefined) {
                    this.model.set('views', 1)
                    this.model.save()
                } else {
                    this.model.set('views', this.model.get("views") + 1)
                    this.model.save()
                }

            },
            "click #commentButton": function(e) {
                console.log(e)
                console.log(e.target.attributes[0].nodeValue)
                var coll = new App.Collections.CommunityReportComments()
                coll.CommunityReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
                console.log(coll.toJSON())
                var viw = new App.Views.CommunityReportCommentView({
                    collection: coll,
                    CommunityReportId: e.target.attributes[0].nodeValue
                })
                viw.render()
                $('#debug').append(viw.el)
            }

        },

        vars: {},

        template: _.template($("#template-ReportRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            //vars.avgRating = Math.round(parseFloat(vars.averageRating))
            var vars = this.model.toJSON()

            if (vars.views == undefined) {
                vars.views = 0
            }

            vars.isManager = this.isManager
            var date = new Date(vars.Date)
            vars.Date = date.toUTCString()

            this.$el.append(this.template(vars))


        },


    })

})