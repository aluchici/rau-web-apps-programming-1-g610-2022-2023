const open_navigation = () => {
	let nav_el = document.getElementById("slidermenu");
	let menu_el = document.getElementById("menuwrapper");
	/////////////////////////////////////////////////////
	nav_el.classList.add("slider-open");
	setTimeout(() => {
		menu_el.classList.add("menu-open");
	}, 100);
	return;
};

const close_navigation = () => {
	let nav_el = document.getElementById("slidermenu");
	let bg_btn = document.getElementById("menuburger");
	let menu_el = document.getElementById("menuwrapper");
	menu_el.classList.remove("menu-open");
	setTimeout(() => {
		nav_el.classList.remove("slider-open");
		bg_btn.classList.remove("burger-opened");
	}, 500);
	return;
};

const toggle_profilepanel = () => {
	let profile_txt = document.getElementById("profile-text");
	let profile_el = document.getElementById("profilepanel");
	/////////////////////////////////////////////////////////
	profile_el.classList.toggle("profile-open");
	setTimeout(() => {
		profile_txt.classList.toggle("profile-text-open")
	}, 200);
	return;
};
