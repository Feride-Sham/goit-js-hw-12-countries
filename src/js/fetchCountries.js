import refs from "./refs.js";
import showNotification from "./error.js";
import listCountryTemplate from "../templates/list.hbs";
import countryCardTemplate from "../templates/card.hbs";

const _ = require("lodash");
let { input, countryList, countryCard } = refs;

input.addEventListener("input", _.debounce(onInputCountry, 1000));
countryList.addEventListener("click", selectCountry);

// функция создания URL по введденному запросу пользователя
function onInputCountry(ev) {
  let url = `https://restcountries.eu/rest/v2/name/${ev.target.value}`;
  clearSearch();
  fetchCountries(url);
}

function fetchCountries(url) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if (res.status === 404) {
        let text = "This country is not found";
        showNotification(text);
      }
      return res;
    })
    .then((result) => {
      if (result.length === 1) {
        createCountryCard(result);
      } else if (result.length <= 10) {
        createCountryList(result);
      } else if (result.length > 10) {
        let text =
          "Too many matches found. Please, enter a more specific query";
        showNotification(text);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// функция, к-рая очищает динамически созданную разметку
function clearSearch() {
  countryList.innerHTML = "";
  countryCard.innerHTML = "";
  countryCard.classList.remove("country-box");
}

// функция, к-рая динамически отрисовывает список стран
function createCountryList(res) {
  countryList.insertAdjacentHTML("beforeend", listCountryTemplate(res));
}

// функция выбора определенной страны из списка
function selectCountry(ev) {
  input.value = ev.target.textContent.trim();
  let url = `https://restcountries.eu/rest/v2/name/${input.value}`;
  clearSearch();
  fetchCountries(url);
}

// функция, к-рая динамически отрисовывает карточку введенной страны
function createCountryCard(res) {
  countryCard.classList.add("country-box");
  countryCard.insertAdjacentHTML("beforeend", countryCardTemplate(res));
}
