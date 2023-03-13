const axios = require("axios");
const cheerio = require("cheerio");

const getHTML = async () => {
  const url =
    "https://www.themoviedb.org/person/1303037-taron-egerton?language=en-GB";
  // const response = await axios.get(url);
  // const html = response.data;
  const { data: html } = await axios.get(url);
  return html;
};

const getFirstFilm = (taronData) => {
  const film = taronData[0];
  console.log(film);
  return film;
};

const getFirstJohnnyFilm = (taronData) => {
  const johnnyFilm = taronData.find((x) => x.role.includes("Johnny"));
  console.log(johnnyFilm);
  return johnnyFilm;
};

const getAllJohnnyFilms = (taronData) => {
  const allJohnnyFilms = taronData.filter((x) => x.role.includes("Johnny"));
  const allJohnnyTitles = allJohnnyFilms.map((x) => x.title);
  console.log(allJohnnyTitles);
  return allJohnnyTitles;
};

const addBestMovie = (taronData) => {
  const bestMovies = taronData.map((x) => {
    if (x.role.includes("Johnny")) {
      x.notes = "best movie";
    }
    return x;
  });
};

const main = async () => {
  let taronData = [];

  const html = await getHTML();
  const $ = cheerio.load(html);
  const table = $(".credits_list > table:nth-child(2)");

  $(table)
    .find("tr")
    .each((i, movie) => {
      if ($(movie).find(".credit_group").length) {
        return;
      }
      const year = $(movie).find(".year").text();
      const title = $(movie).find(".tooltip").text();
      const role = $(movie).find(".character").text();

      taronData.push({ year: year, title: title, role: role });
    });

  taronData = taronData.filter((x) => x.year !== "—");
  console.log(taronData);

  getFirstFilm(taronData);
  getFirstJohnnyFilm(taronData);
  console.log("All Johnny films");
  getAllJohnnyFilms(taronData);
  addBestMovie(taronData);
};

main();
