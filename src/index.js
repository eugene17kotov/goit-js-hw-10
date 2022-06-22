import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('input#search-box');
const countryRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  const countryName = e.target.value.trim();

  if (countryName === '') {
    resetCountryInfo();

    return;
  }

  fetchCountries(countryName).then(renderCountriesMarkup).catch(onFetchError);
}

function renderCountriesMarkup(countries) {
  if (countries.length > 10) {
    resetCountryInfo();

    Notify.info('Too many matches found. Please enter a more specific name.');
  }

  if (countries.length >= 2 && countries.length <= 10) {
    const countriesListMarkup = countries
      .map(
        ({ flags, name }) =>
          `<li class="country__item">
            <img src=${flags.svg} alt=${name.common} width="25" height="25"/>
            <p class="country__name">${name.official}</p>
           </li>`
      )
      .join('');

    getCountryInfoVisible();

    countryRef.innerHTML = `<ul class="country-list">${countriesListMarkup}</ul>`;
  }

  if (countries.length === 1) {
    const { flags, name, capital, population, languages } = countries[0];
    const langs = Object.values(languages).join(', ');

    getCountryInfoVisible();

    countryRef.innerHTML = `
        <div class="title__wrapper">
            <img src="${flags.svg}" alt="${name.common}" width="25" height="25" />
            <h1 class="title">${name.official}</h1>
        </div>
        <p class="country__properties">
            <span>Capital</span>: ${capital}
        </p>
        <p class="country__properties">
            <span>Population</span>: ${population}
        </p>
        <p class="country__properties">
            <span>Languages</span>: ${langs}
        </p>`;
  }
}

function onFetchError(error) {
  resetCountryInfo();
  Notify.failure('Oops, there is no country with that name');
}

function resetCountryInfo() {
  countryRef.classList.add('hidden');
  countryRef.innerHTML = '';
}

function getCountryInfoVisible() {
  countryRef.classList.remove('hidden');
}
