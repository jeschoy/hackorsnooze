"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// Show submit story form when clicking on navbar
function submitStoryForm(evt) {
  console.debug("submitStory", evt);
  hidePageComponents();
  $allStoriesList.show();
  $newStoryForm.slideDown();
}

$submit.on("click", submitStoryForm);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navLogOut.show();
  $loggedIn.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// To show favorites page
function showFavorites() {
  showFavoritesList();
  hidePageComponents();
  $favoritesList.show();
}

// To show user's stories page
function showUserStories() {
  showUserStoriesList();
  hidePageComponents();
  $myStoriesList.show();
}

$myStories.on("click", showUserStories);
$myFavorites.on("click", showFavorites);
