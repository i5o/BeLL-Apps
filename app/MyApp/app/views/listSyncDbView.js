$(function() {

	window.isActivityLogChecked = false;
	App.Views.listSyncDbView = Backbone.View.extend({
		id: "invitationForm",

		events: {
			"click #cancelButton": "hidediv",
			"click #formButton": "syncData",
			"click #selectAll": "selectAll"
		},
		hidediv: function() {
			$('#invitationdiv').fadeOut(1000)

			setTimeout(function() {
				$('#invitationdiv').hide()
			}, 1000);
		},
		render: function() {

			// <input type="checkbox" value="Resources" name="syncData">Resources<br>
			//<input type="checkbox" value="Application" name="syncData" >Application<br><br><br>
			// added "Members Db" checkbox
			var $button = $('<h6>Select Item(\'s) To Sync</h6><br><br><input type="checkbox" value="ActivityReports" name="syncData">Log Activity Reports<br><input type="checkbox" value="Reports" name="syncData">Reports<br><input type="checkbox" value="ResourcesFeedbacks" name="syncData">Resources Feedbacks<br><input type="checkbox" value="ApplicationFeedbacks" name="syncData">Application Feedbacks<br><input type="checkbox" value="MembersDb" name="syncData">Members Database<br>')

			this.$el.append($button)
			this.$el.append('<button class="btn btn-info" id="selectAll" style="width:110px">Select All</button><button style="margin-left:10px; width:110px" class="btn btn-success" id="formButton" style="width:110px">Send</button>')
			this.$el.append('<button class="btn btn-warning" id="cancelButton" style="width:110px;margin-left:10px">Cancel</button>')
		},
		selectAll: function() {
			if ($("#selectAll").text() == 'Select All') {
				$("input[name='syncData']").each(function() {
					$(this).prop('checked', true);
				})
				$("#selectAll").text('Unselect All')
			} else {
				$("input[name='syncData']").each(function() {
					$(this).prop('checked', false);
				})
				$("#selectAll").text('Select All')

			}
		},
		syncData: function() {
			var context = this
			App.startActivityIndicator()
			$("input[name='syncData']").each(function() {
				if ($(this).is(":checked")) {
					if ($(this).val() == 'Resources') {
						context.ReplicateResource()
					} else if ($(this).val() == 'ActivityReports') {
						isActivityLogChecked = true;
						context.syncLogActivitiy()
					} else if ($(this).val() == 'Reports') {
						context.syncReports()
					} else if ($(this).val() == 'ResourcesFeedbacks') {
						context.syncResourcesFeedbacks()
					} else if ($(this).val() == 'ApplicationFeedbacks') {
						context.syncApplicationFeedbacks()
					}
					//**************************************************************************************************
					//Replicate Members db from community to nation
					else if ($(this).val() == 'MembersDb') {
						context.syncMembersDb()
					}
					//**************************************************************************************************
					if ($(this).val() == 'Application') {
						context.checkAvailableUpdates()
					}
				}
			})
			$('#invitationdiv').fadeOut(1000)
			setTimeout(function() {
				$('#invitationdiv').hide()
			}, 1000);
		},
		ReplicateResource: function() {

			App.startActivityIndicator()

			var that = this
			var temp = $.url().attr("host").split(".")
			var currentHost = $.url().attr("host")

			var nationURL = ''
			var nationName = ''
			var type = ''

			var configurations = Backbone.Collection.extend({

				url: App.Server + '/configurations/_all_docs?include_docs=true'
			})
			var config = new configurations()
			config.fetch({
				async: false
			})
			var currentConfig = config.first()
			var cofigINJSON = currentConfig.toJSON()

			type = cofigINJSON.rows[0].doc.type
			nationURL = cofigINJSON.rows[0].doc.nationUrl
			nationName = cofigINJSON.rows[0].doc.nationName
			App.$el.children('.body').html('Please Wait…')
			var waitMsg = ''
			var msg = ''
			$.ajax({
				url: 'http://' + nationName + ':' + App.password + '@' + nationURL + ':5984/communities/_all_docs?include_docs=true',
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					for (var i = 0; i < json.rows.length; i++) {
						var community = json.rows[i]
						var communityurl = community.doc.url
						var communityname = community.doc.name
						msg = waitMsg
						waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
						App.$el.children('.body').html(waitMsg)
						that.synchCommunityWithURL(communityurl, communityname)
						waitMsg = msg
						waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.'
						App.$el.children('.body').html(waitMsg)
					}
					if (type != "nation") {
						msg = waitMsg
						waitMsg = waitMsg + '<br>Replicating to ' + communityname + '. Please wait…'
						that.synchCommunityWithURL(nationURL, nationName)
						waitMsg = msg
						waitMsg = waitMsg + '<br>Replication to ' + communityname + ' is complete.<br>Replication completed.'
					}
				}
			})
		},
		synchCommunityWithURL: function(communityurl, communityname) {
			console.log('http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources')
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "resources",
					"target": 'http://' + communityname + ':' + App.password + '@' + communityurl + ':5984/resources'
				}),
				success: function(response) {

				},
				async: false
			})
		},
		syncReports: function() {

			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "communityreports",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/communityreports'
				}),
				success: function(response) {
					alert(App.languageDict.attributes.Reports_Replicated_Success)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})
		},
		syncLogActivitiy: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "activitylog",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/activitylog'
				}),
				success: function(response) {
					$.ajax({
						url: 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community/_design/bell/_view/getCommunityByCode?_include_docs=true&key="' + App.configuration.get('code') + '"',
						type: 'GET',
						dataType: 'jsonp',
						success: function(result) {
							var communityModel = result.rows[0].value;
							var communityModelId = result.rows[0].id;
							//Replicate from Nation to Community
							$.ajax({
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json; charset=utf-8'
								},
								type: 'POST',
								url: '/_replicate',
								dataType: 'json',
								data: JSON.stringify({
									"source": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
									"target": "community",
									"doc_ids": [communityModelId]
								}),
								success: function(response) {
									console.log("Successfully Replicated.");
									var date = new Date();
									var year = date.getFullYear();
									var month = (1 + date.getMonth()).toString();
									month = month.length > 1 ? month : '0' + month;
									var day = date.getDate().toString();
									day = day.length > 1 ? day : '0' + day;
									var formattedDate = month + '-' + day + '-' + year;
									communityModel.lastActivitiesSyncDate = month + '/' + day + '/' + year;
									//Update the record in Community db at Community Level
									$.ajax({

										headers: {
											'Accept': 'application/json',
											'Content-Type': 'multipart/form-data'
										},
										type: 'PUT',
										url: App.Server + '/community/' + communityModelId + '?rev=' + communityModel._rev,
										dataType: 'json',
										data: JSON.stringify(communityModel),
										success: function(response) {
											//Replicate from Community to Nation
											$.ajax({
												headers: {
													'Accept': 'application/json',
													'Content-Type': 'application/json; charset=utf-8'
												},
												type: 'POST',
												url: '/_replicate',
												dataType: 'json',
												data: JSON.stringify({
													"source": "community",
													"target": 'http://' + App.configuration.get('nationName') + ':oleoleole@' + App.configuration.get('nationUrl') + '/community',
													"doc_ids": [communityModelId]
												}),
												success: function(response) {
													alert(App.languageDict.attributes.ActivityReports_Replicated_Success)
													App.stopActivityIndicator();
												},
												async: false
											});
										},

										async: false
									});
								},
								async: false
							});
						},
						error: function() {
							console.log('http://' + nationName + ':oleoleole@' + nationURL + '/community/_design/bell/_view/getCommunityByCode?key="' + App.configuration.get('code') + '"');
						}
					});

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})


		},

		syncResourcesFeedbacks: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "feedback",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/feedback'
				}),
				success: function(response) {
					alert(App.languageDict.attributes.FeedbackDb_Replicated_Success)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})


		},

		syncApplicationFeedbacks: function() {
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "report",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/report'
				}),
				success: function(response) {
					alert(App.languageDict.attributes.FeedbackDb_Replicated_Success)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})
		},
		//******************************************************************************************************************
		//Replicate Members Db from community to nation
		syncMembersDb: function() {
			/*$.couch.replicate("members", 'http://'+ App.configuration.get('nationName') +':'+App.password+'@'+ App.configuration.get('nationUrl') + '/members' , "filter:_design/bell/adminFilter", {
			 success: function(data) {
			 alert("Members database replicated successfully.");
			 if(isActivityLogChecked == false) {
			 App.stopActivityIndicator();
			 }
			 },
			 error: function(status) {
			 alert("Members database replication failed.");
			 }
			 }, {
			 create_target: true
			 });*/
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": "members",
					"target": 'http://' + App.configuration.get('nationName') + ':' + App.password + '@' + App.configuration.get('nationUrl') + '/members',
					"filter": "bell/adminFilter"
				}),
				success: function(response) {
					alert(App.languageDict.attributes.MemberDb_Replicated)
					if (isActivityLogChecked == false) {
						App.stopActivityIndicator();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(App.languageDict.attributes.TryLater_Error)
				}
			})
		},
		//*************************************************************************************************************
		//following function compare version numbers.
		/*<li>0 if the versions are equal</li>
		 A negative integer iff v1 < v2
		 A positive integer iff v1 > v2
		 NaN if either version string is in the wrong format*/

		versionCompare: function(v1, v2, options) {
			var lexicographical = options && options.lexicographical;
			zeroExtend = options && options.zeroExtend;
			v1parts = v1.split('.');
			v2parts = v2.split('.');

			function isValidPart(x) {
				return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
			}

			if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
				return NaN;
			}

			if (zeroExtend) {
				while (v1parts.length < v2parts.length) v1parts.push("0");
				while (v2parts.length < v1parts.length) v2parts.push("0");
			}

			if (!lexicographical) {
				v1parts = v1parts.map(Number);
				v2parts = v2parts.map(Number);
			}

			for (var i = 0; i < v1parts.length; ++i) {
				if (v2parts.length == i) {
					return 1;
				}

				if (v1parts[i] == v2parts[i]) {
					continue;
				} else if (v1parts[i] > v2parts[i]) {
					return 1;
				} else {
					return -1;
				}
			}

			if (v1parts.length != v2parts.length) {
				return -1;
			}

			return 0;
		},
		checkAvailableUpdates: function() {
			var context = this;
			var configuration;
			var configurationModel = new App.Collections.Configurations()
			configurationModel.fetch({
				success: function(res) {
					configuration = res.first()

				},
				async: false
			})
			var nationName = configuration.get("nationName")
			var nationURL = configuration.get("nationUrl")
			var nationConfigURL = 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true'

			// console.log(nationConfig)
			// alert('check')
			//alert('http://' + nationName + ':oleoleole@' + nationURL + ':5984/configurations/_all_docs?include_docs=true')
			$.ajax({
				url: nationConfigURL,
				type: 'GET',
				dataType: "jsonp",
				success: function(json) {
					var nationConfig = json.rows[0].doc
					nationConfigJson = nationConfig
					if (typeof nationConfig.version === 'undefined') {
						/////No version found in nation
					} else if (nationConfig.version == configuration.get('version')) {
						///No updatea availabe
					} else {
						if (context.versionCompare(nationConfig.version, configuration.get('version')) < 0) {
							console.log("Nation is at low level")
						} else if (context.versionCompare(nationConfig.version, configuration.get('version')) > 0) {
							context.updateApp()
						} else {
							console.log("Nation is uptodate")
						}
					}
				}
			})
			return;
		},
		updateApp: function() {

			var configurations = Backbone.Collection.extend({
				url: App.Server + '/configurations/_all_docs?include_docs=true'
			})
			var config = new configurations()
			config.fetch({
				async: false
			})
			var currentConfig = config.first().toJSON().rows[0].doc
			currentConfig.version = this.latestVersion
			var nationName = currentConfig.nationName
			var nationURL = currentConfig.nationUrl
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json; charset=utf-8'
				},
				type: 'POST',
				url: '/_replicate',
				dataType: 'json',
				data: JSON.stringify({
					"source": 'http://' + nationName + ':oleoleole@' + nationURL + ':5984/apps',
					"target": "apps"
				}),
				success: function(response) {
					console.log(response)
				},
				async: false
			})

			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data'
				},
				type: 'PUT',
				url: App.Server + '/configurations/' + currentConfig._id + '?rev=' + currentConfig._rev,
				dataType: 'json',
				data: JSON.stringify(currentConfig),
				success: function(response) {
					console.log(response)
					alert(App.languageDict.attributes.Updated_NewVersion_Success)
				},
				async: false
			})

		}
	})

})