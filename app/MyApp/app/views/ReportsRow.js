$(function() {

    App.Views.ReportsRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                if (confirm(App.languageDict.attributes.Confirm_Report)) {
                this.model.destroy()
                event.preventDefault();
                alert(App.languageDict.attributes.Reports_Deleted_Success);
                }
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
                var coll = new App.Collections.CommunityReportComments()
                coll.CommunityReportId = e.target.attributes[0].nodeValue
                coll.fetch({
                    async: false
                })
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
            vars.languageDict=App.languageDict;
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