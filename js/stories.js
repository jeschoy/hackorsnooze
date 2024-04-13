"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
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
       ${showFavorites(story)}
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
  $allStoriesList.show();
  $newStoryForm.slideUp();
}

// To generate star for favorites

function showFavorites(story) {
  if (currentUser.favorites.length === 0) {
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
  putStoriesOnPage();
}

$newStoryForm.on("submit", addStoriesToPage);
