$(function() {

    App.Views.PublicationCourseRow = Backbone.View.extend({

        tagName: "tr",
        admn: null,
        events: {
            "click .destroy": function(event) {
                var publicationObject = new App.Models.Publication({
                    _id: this.Id
                })
                publicationObject.fetch({
                    async: false
                })
                var courses = publicationObject.get('courses');

                for (var j in courses) {
                    if (courses[j]['courseID'] === this.model.get('_id')) { // if courseId matches with id of an already added course's id, return
                        courses.splice(j, 1);
                        break;
                    }
                }


                //			var index=courses.indexOf(this.model.get('_id'))
                //			if (index > -1) {
                // 			   courses.splice(index, 1);
                //			}
                this.$el.hide()

                publicationObject.set({
                    'courses': courses
                })
                publicationObject.save()
            }

        },

        vars: {},

        template: _.template($("#template-publication-CourseRow").html()),

        initialize: function(e) {
            this.model.on('destroy', this.remove, this)
        },

        render: function() {
            var vars = this.model.toJSON()
            this.$el.append(this.template(vars))
        },


    })

})