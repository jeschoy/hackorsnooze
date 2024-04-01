'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $navLogin.hide();
  $navLogOut.show();
  $loggedIn.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitStory() {
  console.debug('submitStory');
  hidePageComponents();
  $newStoryForm.show();
}

$submit.on('click', submitStory);
