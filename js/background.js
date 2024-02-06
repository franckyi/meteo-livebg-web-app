import { PEXELS_APIKEY } from "../js/api-variables.js";

function replaceBackground(data) {
  let randomIndex = Math.floor(Math.random() * (data.photos.length + 1));
  let imageUrl;
  let h = window.innerHeight;
  let w = window.innerWidth;

  if (h > w) {
    imageUrl = data.photos[randomIndex].src.portrait;
  } else if (h < w) {
    imageUrl = data.photos[randomIndex].src.landscape;
  }
  if (typeof imageUrl === "undefined") {
    document.body.style.backgroundImage = "url(" + "../images/fb.jpg" + ")";
  } else {
    document.body.style.backgroundImage = "url(" + imageUrl + ")";
  }
}

function fetchImage(query) {
  fetch(`https://api.pexels.com/v1/search?query=${query}`, {
    headers: { Authorization: PEXELS_APIKEY },
  })
    .then((resp) => resp.json())
    .then((data) => {
      replaceBackground(data);
    });
}

export const chooseWord = function (temp, description) {
  console.warn(temp, description);
  fetchImage(description);
};
