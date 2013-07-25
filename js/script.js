$(document).ready(function() {

	//automatically hiding the login
	var init = function() {

		$.ajax({
			url : "xhr/check_login.php",
			type : "get",
			dataType : "json",
			success : function(r) {
				console.log(r);
				if (r.user) {
					loadApp(r.user);
					//if login checks out properly, load and run app
				} else {
					loadWelcome()
				}
			}
		});

	};
	//init

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
			});

		});

	};
	// loadWelcome

	var loadApp = function(user) {

		$(".wrap").html(" ");
		//clears the landing

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
				
				$("#tabs").tabs();
			});
			
		});

	};
	//load app

	var loadSettings = function() {

		$(".wrap").html(" ")//clears app

		$.get("templates/app.html", function(account) {
			var accountFind = $(account).find("account-template").html();
			$.template("accounttemp", accountFind);
			var accounthtml = $.render(" ", "accounttemp");
			$(".wrap").append(accounthtml);
		});

	};
	//load settings

	init();

	//show login after power clicked
	$("#loginPower").live("click", function(e) {
		e.preventDefault();
		console.log("power login clicked");

		$("#login").toggle();
	});
	//loginPower

	//When loginBtn is clicked, run log in
	$("#loginBtn").live("click", function(e) {
		console.log("login btn clicked");
		e.preventDefault();

		var valid = true;
		var loginName = $("#uNameLogin");
		var loginPass = $("#passLogin");

		//reset css
		loginName.css({
			boxShadow : "0 0 5px 3px #111c16"
		});
		loginPass.css({
			boxShadow : "0 0 5px 3px #111c16"
		});

		//Ifs for individual errors
		if (loginName.val() == "") {
			loginName.css({
				boxShadow : "0 0 5px 3px #b4282b"
			});
			valid = false;
		}
		if (loginPass.val() == "") {
			loginPass.css({
				boxShadow : "0 0 5px 3px #b4282b"
			});
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
					loginName.css({
						boxShadow : "0 0 5px 3px #b4282b"
					});
					loginPass.css({
						boxShadow : "0 0 5px 3px #b4282b"
					});
				} else {
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
					console.log("you broke this too");
				} else {
					console.log("signed in");
					loadApp();
				}
			}
		});
		//ajax
	});
	//registerBtn

	//show logout after power click
	$("#logoutPower").live("click", function(e) {
		e.preventDefault();
		console.log("logout power clicked");

		$("#logout").toggle();
	});
	//logoutPower

	//settings btn
	$("#settingsBtn").live("click", function(e) {
		e.preventDefault();
		$(".wrap").html(" ");
		//clears the app
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
});
//whole closing
