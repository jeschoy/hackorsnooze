"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  $favoritesList.hide();
  $myStoriesList.hide();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
       ${showFavoritesStar(story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  hidePageComponents();
  $allStoriesList.show();
  // $favoritesList.hide();
  // $myStoriesList.hide();
  $newStoryForm.slideUp();
}

// To generate star for favorites

function showFavoritesStar(story) {
  if (!currentUser || currentUser.favorites.length === 0) {
    return `<span class="favorite"><i class="fa-star far"></i></span>`;
  } else {
    for (let fav of currentUser.favorites) {
      if (fav.storyId === story.storyId) {
        return `<span class="favorite"><i class="fa-star fas"></i></span>`;
      }
    }
    return `<span class="favorite"><i class="fa-star far"></i></span>`;
  }
}

// To show favorites list
function showFavoritesList() {
  console.debug("addFavoritesList");

  $favoritesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoritesList.append("<h3>No favorites!</3>");
  } else {
    for (let fav of currentUser.favorites) {
      const $story = generateStoryMarkup(fav);
      $favoritesList.append($story);
    }
  }
  $favoritesList.show();
}

// To show user's stories
function showUserStoriesList() {
  console.debug("addUserStories");

  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<h3>No stories! Submit one now!</3>");
  } else {
    for (let myStory of currentUser.ownStories) {
      const $story = generateStoryMarkup(myStory);
      $story.prepend(`<i class = "fa-regular fa-trash-can delete-btn"></i>`);
      $myStoriesList.append($story);
    }
  }
}

// For users to add stories to the page
async function addStoriesToPage(evt) {
  evt.preventDefault();
  console.debug("addStoriesToPage");
  const author = $("#author-name").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const newStory = await storyList.addStory(currentUser, {
    title,
    author,
    url,
  });
  $newStoryForm.trigger("reset");
  putStoriesOnPage();
}

$newStoryForm.on("submit", addStoriesToPage);
