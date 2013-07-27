$(document).ready(function() {

	//checking if a user is logged in
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
					loadWelcome()
				};
			}//success function
		});

	};//init

	//Load the welcome/landing page
	var loadWelcome = function() {

		//load top-temp
		$.get("templates/landing.html", function(top) {
			var topFind = $(top).find("#top-template").html();
			$.template("toptemplate", topFind);
			var tophtml = $.render(" ", "toptemplate");
			$(".wrap").append(tophtml);

			//load welcome-temp
			$.get("templates/landing.html", function(welcome) {
				var welcomeFind = $(welcome).find("#welcome-template").html();
				$.template("welcometemp", welcomeFind);
				var welcomehtml = $.render(" ", "welcometemp");
				$(".wrap").append(welcomehtml);
			});//load welcome-temp

		});//load-top

	};//load welcome

	//LOAD THE APPLICATION
	var loadApp = function(user) {

		$(".wrap").html(" ");
		//clears existing template

		//load app-top
		$.get("templates/app.html", function(topApp) {
			var topFind = $(topApp).find("#application-top").html();
			$.template("toptemplate", topFind);
			var tophtml = $.render(" ", "toptemplate");
			$(".wrap").append(tophtml);

			//load app-temp
			$.get("templates/app.html", function(scheme) {
				var appFind = $(scheme).find("#application-template").html();
				$.template("apptemp", appFind);
				var apphtml = $.render(" ", "apptemp");
				$(".wrap").append(apphtml);
				$('#hello').html('Hello, ' + user.first_name);
				
				$("#tab-container").easytabs();
				
				//Toggle add tasks
				$("#taskPlus").live("click", function(e) {
					e.preventDefault();
					console.log("taskPlus clicked");
					$("#addTask").toggle();
				});//toggle add task
				
				//Toggle add project
				$("#projectPlus").live("click", function(f) {
					f.preventDefault();
					console.log("projectPlus clicked");
					$("#addProject").toggle();
				});//toggle add project
				
			});//load app-temp
			
		});//app-top

	};//load app

	init();
	
	//LOAD ACCOUNT SETTINGS
	var loadSettings = function() {
		//LOAD TOP
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
				
				//when you click on the logo, load app
				$(".logo").live("click", function(e) {
					e.preventDefault();
					console.log("logo clicked");
					loadApp();
				})//logo click
				
			})//get account
		});//get top
	}; //loadSettings

	//show login after power clicked
	$("#loginPower").live("click", function(e) {
		e.preventDefault();
		console.log("power login clicked");

		$("#login").toggle();
	});
	//loginPower
	
	//LOGIN
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
					loadApp();
				};
			} //response function
		});
		//ajax
	});
	//loginBtn

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
					loadApp();
				};
			}//response function
		});//ajax
	});
	//registerBtn

	//show logout after power click
	$("#logoutPower").live("click", function(e) {
		e.preventDefault();
		console.log("logout power clicked");

		$("#logout").toggle();
		
		//cancel clicked
		$("#cancel").live("click", function(e) {
			e.preventDefault;
			$("#logout").toggle();
		})
	});
	//logoutPower

	//settings btn
	$("#settingsBtn").live("click", function(e) {
		e.preventDefault();
		console.log("settings clicked")
		$(".wrap").html(" "); //clears the app
		loadSettings();
	})
	
	//logoutBtn clicked, load inti()
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
