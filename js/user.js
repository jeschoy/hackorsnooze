"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");
  $loginForm.hide();

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
  $signupForm.hide();
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
    // localStorage.setItem("favorites", currentUser.favorites);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  hidePageComponents();

  putStoriesOnPage();
  $allStoriesList.show();

  updateNavOnLogin();
  $signupForm.hide();
  $loginForm.hide();
}

// To favorite or unfavorite a story
async function toggleFavorite(evt) {
  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);
  if ($target.hasClass("far")) {
    await currentUser.addOrRemoveFavorite("POST", story);
    $target.closest("i").toggleClass("far fas");
    currentUser.favorites.push(story);
  } else {
    await currentUser.addOrRemoveFavorite("DELETE", story);
    $target.closest("i").toggleClass("fas far");
    currentUser.favorites = currentUser.favorites.filter(
      (s) => s.storyId !== story.storyId
    );
  }
  return storyId;
}

$body.on("click", ".favorite", toggleFavorite);

// To delete a story from the storylist and ownstories
$body.on("click", ".delete-btn", async function (e) {
  const $target = $(e.target);
  const storyId = $target.closest("li").attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);
  currentUser.ownStories = currentUser.ownStories.filter(
    (s) => s.storyId !== story.storyId
  );
  storyList.stories = storyList.stories.filter(
    (s) => s.storyId !== story.storyId
  );
  await currentUser.removeStory(story);
  showUserStories();
});
