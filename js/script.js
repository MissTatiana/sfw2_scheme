$(document).ready(function() {
	
	
/*	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=
 						Check if user is logged in
=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	*/
	var init = function() {
		$.ajax({
			url : "xhr/check_login.php",
			type : "get",
			dataType : "json",
			success : function(response) {
				console.log(response);
				if (response.user) {
					//if a user is logged in, load app (keep loaded)
					loadApp(response.user);
				} else {
					//if a user is not logged in, load welcome
					loadWelcome();
				};
			}//success function
		});//ajax check login

	};//init

/*	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=
 						Load Landing/Welcome page
=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	*/
	var loadWelcome = function() {

		//load top-temp
		$.get("templates/landing.html", function(top) {
			var topFind = $(top).find("#top-template").html();
			$.template("toptemplate", topFind);
			var tophtml = $.render(" ", "toptemplate");
			$(".wrap").append(tophtml);

			//load the body in the top so they always load together
			//load welcome-temp
			$.get("templates/landing.html", function(welcome) {
				var welcomeFind = $(welcome).find("#welcome-template").html();
				$.template("welcometemp", welcomeFind);
				var welcomehtml = $.render(" ", "welcometemp");
				$(".wrap").append(welcomehtml);
			});//load welcome-temp

		});//load-top

	};//load welcome
	
/*	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=
 						Loading the Application
=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	*/

	//LOAD THE APPLICATION
	var currentUser = {};
	
	var loadApp = function(user) {
		currentUser = user;
		//clears existing template
		$(".wrap").html(" ");

/*	=	=	=	=	=	=	Load App Top	=	=	=	=	=	=	*/
		$.get("templates/app.html", function(topApp) {
			var topFind = $(topApp).find("#application-top").html();
			$.template("toptemplate", topFind);
			var tophtml = $.render(" ", "toptemplate");
			$(".wrap").append(tophtml);

			//Load the rest of the app in the top so both load at the same time
			//load app-temp
			$.get("templates/app.html", function(scheme) {
				var appFind = $(scheme).find("#application-template").html();
				$.template("apptemp", appFind);
				var apphtml = $.render(" ", "apptemp");
				$(".wrap").append(apphtml);
				$('#hello').html('Hello, ' + user.first_name);
				
				//Calling easy tabs functionality
				$("#tab-container").easytabs();
				
/*	=	=	=	=	=	=	=	=	=		PROJECTS	=	=	=	=	=	=	=	*/
				
				//GET THE PROJECTS
				var getProjects = function() {
					$.ajax({
						url: "xhr/get_projects.php",
						type: "get",
						dataType: "json",
						success: function(response) {
							$.get("templates/app.html", function(projects) {
								var projectsFind = $(projects).find("#projectItems-template").html();
								$.template("projecttemp", projectsFind);
	
								for(i=0; i<response.projects.length; i++){
	
									var projecthtml = $.render(response.projects[i], "projecttemp");
	
									$("#projectContent").append(projecthtml);
									
								};//loop
							});//get tasks
						}//success
					});//ajax
				};//getProject function
				
				getProjects();
				
				//Toggle add project
				$("#projectPlus").live("click", function(f) {
					f.preventDefault();
					console.log("projectPlus clicked");
					$("#addProject").toggle();
					
					//addProjectBtn
					$("#addProjectBtn").live("click", function(p) {
						p.preventDefault();
						console.log("addProjectBtn clicked")
						
						$.ajax({
							url: "xhr/new_project.php",
							data: {
								projectName: $("#projectTitle").val(),
								projectDescription: $("#projectDesc").val(),
								dueDate: $("#projectDue").val(),
								status: $("#projectPriority").val()
							},
							type: "post",
							dataType: "json",
							success: function(response){
								
								if(response.error){
									console.log(response);
									$("#projectTitle").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#projectDesc").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#projectDue").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#projectPriority").css({ boxShadow : "0 0 5px 3px #b4282b" });
								}
								else{
									console.log("repoonse");
									$("#addProject").toggle();
									location.reload();
								};
							}//reponse
						});//ajax
						
						
					});//addProjectBtn
					
				});//toggle add project
				
				//Edit existing project (toggle)
				$("#cogProject").live("click", function(ep) {
					ep.preventDefault();
					console.log("cogProject clicked");
					getProjectTitle();
					$("#editProject").toggle();
					
					var clickedPID = $(this).parent().prev().find('.proid').val();
					console.log(clickedPID);
					
					
					//Project details (from existing)
					//use traversing the fill in the existing information
					//this.find( item ) - dig through the html
					var projectTitle = $(this).parent("#projectTools").prev().prev().find("h5");
					$("#editProjectTitle").val(projectTitle.html());
					
					$("#projectIDedit").val(clickedPID);
					
					var projectDescription = $(this).parent("#projectTools").prev().prev().find("p");
					$("#editProjectDesc").val(projectDescription.html());
					
					var projectPriority = $(this).parent("#projectTools").prev().find("h6");
					$("#editProjectPriority").val(projectPriority.html());
					
					var projectDate = $(this).parent("#projectTools").prev().find("p");
					$("#editProjectDue").val(projectDate.html());
					
					$("#editProjectBtn").live("click", function(b) {
						b.preventDefault();
						console.log("editProjectBtn clicked");
						
						$.ajax({
							url: "xhr/update_project.php",
							data: {
								projectName: $("#editProjectTitle").val(),
								projectID: clickedPID,
								projectDescription: $("#editProjectDesc").val(),
								status: $("#editProjectPriority").val(),
								dueDate: $("#EditProjectDue").val(),
							},
							type: "post",
							dataType: "json",
							success: function(response){
								if(response.error){
									console.log(response);
									
									//Change css if everything is wrong
									$("#editProjectTitle").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#projectIDedit").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#editProjectDesc").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#editProjectPriority").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#EditProjectDue").css({ boxShadow : "0 0 5px 3px #b4282b" });
								}
								else{
									$("#editProject").toggle();
									location.reload();
								}
							}//success 
						});//ajax
					});//editProjectBtn
				});//edit project toggle
				
				//Delete Project
				$("#trashProject").live("click", function(d) {
					d.preventDefault();
					console.log("trashProject clicked");
					
					var clickedPID = $(this).parent().prev().find('.proid').val();
					console.log(clickedPID);
					
					$.ajax({
						url: "xhr/delete_project.php",
						data: {
							projectID: clickedPID
						},
						type: "post",
						dataType: "json"
					}); //ajax
					alert("Project Deleted")
					location.reload();
					
				});//delete Project

/*	=	=	=	=	=	=	=	=	=		TASKS	=	=	=	=	=	=	=	=	*/
				
				//Ajax call to get list of tasks
				var projectArr = [];
				
				//Get the project ID in order to add tasks 
				var getProjectTitle = function() {
						$.ajax({
							url: "xhr/get_projects.php",
							type: "get",
							dataType: "json",
							success: function(response) {
								for(i=0; i<response.projects.length; i++){
									var id = response.projects[i].id;
									$('#forProject').append("<option>" + id + "</option>");
									
									//append to select in edit project
									$("#projectIDedit").append("<option>" + id + "</option>");
									
									//append to select in edit task
									$("#editForProject").append("<option>" + id + "</option>");	
								};//for
								console.log(projectArr);
							}//success
						});//ajax
					};//get project title
					
				//Get tasks, display in list
				var getTask = function() {
					$.ajax({
						url: "xhr/get_tasks.php",
						type: "get",
						dataType: "json",
						success: function(response) {
							$.get("templates/app.html", function(tasks) {
								var tasksFind = $(tasks).find("#taskItems-template").html();
								$.template("tasktemp", tasksFind);
	
								for(i=0; i<response.tasks.length; i++){
	
									var taskhtml = $.render(response.tasks[i], "tasktemp");
	
									$("#taskContent").append(taskhtml);
									
								};//loop
							});//get tasks
						}//success
					});//ajax
				}; //getTask
				
				getTask();
				
				//Toggle add tasks
				$("#taskPlus").live("click", function(e) {
					e.preventDefault();
					console.log("taskPlus clicked");
					getProjectTitle();

					$("#addTask").toggle();
					
					//add Task button
					$("#addTaskBtn").live("click", function(e) {
						e.preventDefault();
						
						//When you click on the addTaskBtn, send new task
						//ajax call for a new task
						$.ajax({
							url: "xhr/new_task.php",
							data: {
								taskName: $("#taskName").val(),
								projectID: $("#forProject").val(),
								taskDescription: $("#taskDesc").val(),
								dueDate: $("#taskDue").val(),
								status: $("#taskStatus").val(),
								priority: $("#taskPriority").val(),
							},
							type: "post",
							dataType: "json",
							success: function(response){
								console.log("addTask btn clicked");

								if(response.error){
									console.log(response);
									$("#taskName").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#taskDesc").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#taskDue").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#taskPriority").css({ boxShadow : "0 0 5px 3px #b4282b" });
								}
								else{
									console.log("response");
									$("#addTask").toggle();
									location.reload();
								};
							}//response
						});//ajax add task
						
					});//addTask btn
					
				});//toggle add task
				
				
				//Edit existing tasks (toggle)
				$("#cogTask").live("click", function(e) {
					e.preventDefault();
					console.log("cogTask clicked");
					getProjectTitle();
					
					$("#editTask").toggle();
					
					//Get the task details by traversing
					//var projectDescription = $(this).parent("#projectTools").prev().prev().find("p");
					//$("#editProjectDesc").val(projectDescription.html());
					var taskName = $(this).parent("#taskTools").prev().prev().find("h5");
					$("#editTaskName").val(taskName.html());
					
					var taskProjectID = $(this).parent("#taskTools").prev().find("#taskpid");
					$("#editForProject").val(taskProjectID.html());
					console.log(taskProjectID.html());
					//what is the val() eqiv for <option>??
					
					var taskDescription = $(this).parent("#taskTools").prev().prev().find("p");
					$("#editTaskDesc").val(taskDescription.html());
					
					var taskStatus = $(this).parent().prev().find('#taskStatusSpot').html();
					$("#editTaskStatus").val(taskStatus);
					//^^ WTF!?!
					console.log(taskStatus);
					
					var taskDue = $(this).parent().prev().find("#taskDueSpot");
					$("#EditTaskDue").val(taskDue.html());
					
					var taskPriority = $(this).parent().prev().find("#taskPrioritySpot");
					$("#editTaskPriority").val(taskPriority.html());
										
					//editTaskBtn
					$("#editTaskBtn").live("click", function(s) {
						s.preventDefault();
						console.log("editTaskBtn clicked");
						
						$.ajax({
							url: "xhr/update_task.php",
							data: {
								taskID: $(".tid").val(),
								taskName: $("#editTaskName").val(),
								taskDescription: $("#editTaskDesc").val(),
								status: $("#editTaskStatus").val(),
								dueDate: $("#EditTaskDue").val(),
								priority: $("#editTaskPriority").val()
							},
							type: "post",
							dataType: "json",
							success: function(response){
								if(response.error){
									console.log(response);
									
									//Change css if everything is wrong
									$("#editForProject").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#editTaskName").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#editTaskDesc").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#editTaskStatus").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#EditTaskDue").css({ boxShadow : "0 0 5px 3px #b4282b" });
									$("#editTaskPriority").css({ boxShadow : "0 0 5px 3px #b4282b" });
								}
								else{
									$("#editTask").toggle();
									location.reload();
								}
							}//success 
						});//ajax
						
					});//editTaskBtn
					
				});//edit tasks
				
				//Delete Task
				$("#trashTask").live("click", function(e) {
					e.preventDefault();
					console.log("trashTask clicked");
					
					var clickedid = $(this).parent().prev().find('.tid').val();
					console.log(clickedid);
					
					$.ajax({
							url: "xhr/delete_task.php",
							data: {
								taskID: clickedid
							},
							type: 'post',
							dataType:'json'
					});//ajax
					alert("Task Deleted");
					location.reload();					
				});//Delete task
				
				
			});//load app-temp
			
		});//app-top

	};//load app

	init();
	
/*	=	=	=	=	=	=	=	=	=	ACCOUNT SETTINGS	=	=	=	=	=	=	=	*/
	var loadSettings = function() {
		//LOAD TOP
		console.log(currentUser.email);

		$.get("templates/landing.html", function(topSet) {
			var setTopFind = $(topSet).find("#top-template").html();
			$.template("topSetTemp", setTopFind);
			var setTopHtml = $.render(" ", "topSetTemp");
			$(".wrap").append(setTopHtml);
			
			//LOAD SETTINGS
			$.get("templates/app.html", function(account) {
				var accountFind = $(account).find("#account-template").html();
				$.template("accountTemp", accountFind);
				var accountHtml = $.render(" ", "accountTemp");
				$(".wrap").append(accountHtml);
				
				//load the users information for account settings
				$("#accEmail").val(currentUser.email);
				$("#accFirst").val(currentUser.first_name);
				$("#accLast").val(currentUser.last_name);
				$("#genUser").val(currentUser.user_n);
				$("#genCity").val(currentUser.city);
				$("#genSt").val(currentUser.state);

				//when you click on the logo, load app
				$(".logo").live("click", function(e) {
					e.preventDefault();
					console.log("logo clicked");
					loadApp();
				})//logo click
				
			});//get account
		});//get top
		
/*	=	=	=	Account Settings Information	=	=	=	*/
		$("#btnSave").live("click", function(e) {
			e.preventDefault();
			console.log("accEmailSave clicked")
			$.ajax({
				url: "xhr/update_user.php", 
				data: {
					email: $("#accnewEmail").val(),
					first_name: $("#accFirst").val(),
					last_name: $("#accLast").val(),
					city: $("#genCity").val(),
					state: $("#genSt").val()
				},
				type: "post",
				dataType: "json",
				success: function(response) {
					console.log(response);
				}//success 
			});//ajax
		});//accEmailSave
		
	}; //loadSettings
	
																												var konami_keys = [40, 40]; var konami_index = 0;
																												$(document).keydown(function(e){ if(e.keyCode === konami_keys[konami_index++]){ if(konami_index === konami_keys.length){ $(document).unbind('keydown', arguments.callee);  $.getScript('http://www.cornify.com/js/cornify.js',function(){ cornify_add(); $(document).keydown(cornify_add); alert("This project is driving me insane!!! - Tatiana :)"); }); } } else{ konami_index = 0; } });
/*	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=
 									LOGIN/LOGOUT
 =	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	=	*/

	//Toggle Login Screen
	$("#loginPower").live("click", function(e) {
		e.preventDefault();
		console.log("power login clicked");

		$("#login").toggle();
	});

	
/*	=	=	=	=	=	=	LOGIN	=	=	=	=	=	=	*/
	//When loginBtn is clicked, run log in
	$("#loginBtn").live("click", function(e) {
		console.log("login btn clicked");
		e.preventDefault();

		//LOGIN VALIDATION
		var valid = true;
		var loginName = $("#uNameLogin");
		var loginPass = $("#passLogin");

		//reset css
		loginName.css({
			boxShadow : "0 #111c16"
		});
		loginPass.css({
			boxShadow : "0 #111c16"
		});

		//Ifs for individual errors
		if (loginName.val() == "") {
			loginName.css({ boxShadow : "0 0 5px 3px #b4282b" });
			valid = false;
		}
		if (loginPass.val() == "") {
			loginPass.css({ boxShadow : "0 0 5px 3px #b4282b" });
			valid = false;
		};
		if (!valid) {
			return false;
		}
		
		$.ajax({
			url : "xhr/login.php",
			data : {
				username : $("#uNameLogin").val(),
				password : $("#passLogin").val()
			},
			type : "post",
			dataType : "json",
			success : function(response) {
				console.log(response);

				if (response.error) {
					console.log("you broke it");
					loginName.css({ boxShadow : "0 0 5px 3px #b4282b" });
					loginPass.css({ boxShadow : "0 0 5px 3px #b4282b" });
				} 
				else {
					console.log("logging in");
					var uid = response.user;
					loadApp(uid);
				};
			} //response function
		});//ajax
	});//loginBtn

/*	=	=	=	=	=	=	=	REGISTER	=	=	=	=	=	=	=	*/
	//When the register btn is clicked, run through ajax to let you in
	$("#register").live("click", function(e) {
		console.log("register btn clicked");
		e.preventDefault();
		
		//REGISTRATION VALIDATION
		var valid = true;
		var regFirst = $("#firstname");
		var regLast = $("#lastname");
		var regEmail = $("#email");
		var regUsername = $("#username");
		var regPassword = $("#password")
		var regPasswordCon = $("#passwordCon");
		
		//reset css
		regFirst.css({ boxShadow : "0 #111c16" });
		regLast.css({ boxShadow : "0 #111c16" });
		regEmail.css({ boxShadow: "0 #111c16" })
		regUsername.css({ boxShadow: "0 #111c16" })
		regPassword.css({ boxShadow: "0 #111c16" })
		regPasswordCon.css({ boxShadow: "0 #111c16" })
		
		//Ifs for individual errors
		if (regFirst.val() == "") {
			regFirst.css({ boxShadow : "0 0 5px 3px #b4282b" });
			valid = false;
		}//regFirst
		if (regLast.val() == "") {
			regLast.css({ boxShadow : "0 0 5px 3px #b4282b" });
			valid = false;
		}//regLast
		if (regEmail.val() == "") {
			regEmail.css({ boxShadow : "0 0 5px 3px #b4282b" })
			valid = false;
		}//regEmail
		if (regUsername.val() == "") {
			regUsername.css({ boxShadow : "0 0 5px 3px #b4282b" })
			valid = false;
		}//regUsername
		if (regPassword.val() == "") {
			regPassword.css({ boxShadow : "0 0 5px 3px #b4282b" })
			valid = false;
		}//regPassword
		if (regPasswordCon.val() == "") {
			regPasswordCon.css({ boxShadow : "0 0 5px 3px #b4282b" })
			valid = false;
		};//regPasswordCon
		if (!valid) {
			return false;
		};

		$.ajax({
			url : "xhr/register.php",
			data : {
				first_name : $("#firstname").val(),
				last_name : $("#lastname").val(),
				email : $("#email").val(),
				username : $("#username").val(),
				password : $("#password").val()
			},
			type : "post",
			dataType : "json",
			success : function(response) {
				console.log(response);

				if (response.error) {
					console.log("you broke it");
					regFirst.css({ boxShadow : "0 0 5px 3px #b4282b" });

					regLast.css({ boxShadow : "0 0 5px 3px #b4282b" });

					regEmail.css({ boxShadow : "0 0 5px 3px #b4282b" });

					regUsername.css({ boxShadow : "0 0 5px 3px #b4282b" });

					regPassword.css({ boxShadow : "0 0 5px 3px #b4282b" });

					regPasswordCon.css({ boxShadow : "0 0 5px 3px #b4282b" });
				
				} 
				else {
					console.log("registered");
					loadApp(uid);
				};
			}//response
		});//ajax
	});//registerBtn
	
/*	=	=	=	Settings click	=	=	=	*/
	$("#settingsBtn").live("click", function(e) {
		e.preventDefault();
		console.log("settings clicked")
		$(".wrap").html(" "); //clears the app
		loadSettings();
	})

/*	=	=	=	=	=	LOGOUT	=	=	=	=	*/
	$("#logoutPower").live("click", function(e) {
		e.preventDefault();
		console.log("logout power clicked");

		$("#logout").toggle();
		
		//cancel clicked
		$("#cancel").live("click", function(e) {
			e.preventDefault;
			$("#logout").toggle();
		});//cancel
	});//logoutPower
	
	
	//Load the welcome after logged out
	$("#logoutBtn").live("click", function(e) {
		e.preventDefault();
		console.log("clicked logout");
		$.ajax({
			url : "xhr/logout.php",
			type : "get",
			success : function(response) {
				if (response.error) {
					console.log("you broke it again")
				} else {
					$(".wrap").html(" ");
					//clears the app
					init();
				}//else
			}//response
		})//ajax
	})//logoutbtn


});//whole closing
