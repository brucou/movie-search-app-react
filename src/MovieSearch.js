import React from "react";
import {
  events,
  LOADING,
  NETWORK_ERROR,
  POPULAR_NOW,
  PROMPT,
  screens as screenIds,
  SEARCH_RESULTS_FOR,
  testIds
} from "./properties";
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";

const {
  PROMPT_TESTID,
  RESULTS_HEADER_TESTID,
  RESULTS_CONTAINER_TESTID,
  QUERY_FIELD_TESTID,
  MOVIE_IMG_SRC_TESTID,
  MOVIE_TITLE_TESTID,
  NETWORK_ERROR_TESTID
} = testIds;
const {
  LOADING_SCREEN,
  SEARCH_ERROR_SCREEN,
  SEARCH_RESULTS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR
} = screenIds;
const {QUERY_RESETTED, QUERY_CHANGED, MOVIE_DETAILS_DESELECTED, MOVIE_SELECTED} = events;
const {div, a, ul, li, input, h1, h3, legend, img, dl, dt, dd} = hyperscript(h);

const eventHandlersFactory = next => ({
  [QUERY_CHANGED]: ev => next({[QUERY_CHANGED]: ev.target.value}),
  [QUERY_RESETTED]: ev => next({[QUERY_CHANGED]: ""}),
  [MOVIE_SELECTED]: (ev, result) => next({[MOVIE_SELECTED]: {movie: result}}),
  [MOVIE_DETAILS_DESELECTED]: ev => next({[MOVIE_DETAILS_DESELECTED]: void 0})
});
const screens = next => ({screen, results, query, details, cast, title}) => {
  const activePage = !screen || [LOADING_SCREEN, SEARCH_RESULTS_AND_LOADING_SCREEN, SEARCH_ERROR_SCREEN, SEARCH_RESULTS_SCREEN].indexOf(screen) > -1 ? "home" : "item";
  const isDiscoveryMode = !query || query.length === 0;
  const filteredResults = results && results.filter(result => result.backdrop_path);
  const hasImdbId = details && details.imdb_id;
  const isLoadingResults = [LOADING_SCREEN, SEARCH_RESULTS_AND_LOADING_SCREEN].indexOf(screen) > -1;
  const isErrorResults = [SEARCH_ERROR_SCREEN].indexOf(screen) > -1;
  const hasResults = [
    LOADING_SCREEN,
    SEARCH_RESULTS_SCREEN,
    SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
    SEARCH_RESULTS_WITH_MOVIE_DETAILS,
    SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR
  ].indexOf(screen) > -1
  const hasMoviePage = [
    SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
    SEARCH_RESULTS_WITH_MOVIE_DETAILS,
    SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR
  ].indexOf(screen) > -1;
  const isLoadingMovieDetails = [SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN].indexOf(screen) > -1;
  const isErrorMovieDetails = [SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR].indexOf(screen) > -1;
  const hasDetailsResults = [SEARCH_RESULTS_WITH_MOVIE_DETAILS].indexOf(screen) > -1 && details;

  function imageTmdbUrl(result) {
    return "http://image.tmdb.org/t/p/w300" + result.backdrop_path;
  }

  function imageTmdbDetailsUrl(details) {
    return details && "http://image.tmdb.org/t/p/w342" + details.poster_path;
  }

  function imageImdbUrl(details) {
    return "https://www.imdb.com/title/" + details.imdb_id + "/";
  }

  return (
    <div className="App uk-light uk-background-secondary" data-active-page={activePage}>
      <div className="App__view-container" onClick={eventHandlersFactory(next)[MOVIE_DETAILS_DESELECTED]}>
        <div className="App__view uk-margin-top-small uk-margin-left uk-margin-right" data-page="home">
          <div className="HomePage">
            <h1>TMDb UI – Home</h1>
            <legend className="uk-legend" data-testid={PROMPT_TESTID}>{PROMPT}</legend>
            <div className="SearchBar uk-inline uk-margin-bottom">
              <a
                className="uk-form-icon uk-form-icon-flip js-clear"
                uk-icon={!isDiscoveryMode ? 'icon:close' : 'icon:search'}
                onClick={eventHandlersFactory(next)[QUERY_RESETTED]}
              >
              </a>
              <input
                className="SearchBar__input uk-input js-input"
                type="text"
                value={query || ""}
                onChange={eventHandlersFactory(next)[QUERY_CHANGED]}
                data-testid={QUERY_FIELD_TESTID}
              />
            </div>
            <h3 className="uk-heading-bullet uk-margin-remove-top" data-testid={RESULTS_HEADER_TESTID}>
              {isDiscoveryMode ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)}
            </h3>
            <div className="ResultsContainer" data-testid={RESULTS_CONTAINER_TESTID}>
              {isLoadingResults
                ? <div>{LOADING}</div>
                : isErrorResults
                  ? <div data-testid={NETWORK_ERROR_TESTID}>{NETWORK_ERROR}</div>
                  : hasResults
                    ? (
                      <ul className="uk-thumbnav">
                        {filteredResults.map(result => (
                          <li className="uk-margin-bottom" key={result.id}>
                            <a
                              href="#"
                              className="ResultsContainer__result-item js-result-click"
                              onClick={ev => eventHandlersFactory(next)[MOVIE_SELECTED](ev, result)}
                              data-id={result.id}
                            >
                              <div className="ResultsContainer__thumbnail-holder"><img src={imageTmdbUrl(result)}
                                                                                       alt=""/>
                              </div>
                              <div
                                className="ResultsContainer__caption uk-text-small uk-text-muted">{result.title}</div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : <div></div>
              }
            </div>
          </div>
        </div>
        {hasMoviePage && (
          <div className="App__view uk-margin-top-small uk-margin-left uk-margin-right" data-page="item">
            <h1>{title || (details && details.title)}</h1>
            {isLoadingMovieDetails
              ? <div>{LOADING}</div>
              : isErrorMovieDetails
                ? <div>{NETWORK_ERROR}</div>
                : hasDetailsResults
                  ?
                  <div className="MovieDetailsPage">
                    <div className="MovieDetailsPage__img-container uk-margin-right" style={{float: "left"}}>
                      <img src={imageTmdbDetailsUrl(details)} alt=""/>
                    </div>
                    <dl className="uk-description-list">
                      <dt>Popularity</dt>
                      <dd>{details.vote_average}</dd>
                      <dt>Overview</dt>
                      <dd>{details.overview}</dd>
                      <dt>Genres</dt>
                      <dd>{details.genres.map(g => g.name).join(", ")}</dd>
                      <dt>Starring</dt>
                      <dd>
                        {
                          cast.cast
                            .slice(0, 3)
                            .map(cast => cast.name)
                            .join(", ")
                        }
                      </dd>
                      <dt>Languages</dt>
                      <dd>{details.spoken_languages.map(g => g.name).join(", ")}</dd>
                      <dt>Original Title</dt>
                      <dd>{details.original_title}</dd>
                      <dt>Release Date</dt>
                      <dd>{details.release_date}</dd>
                      {hasImdbId && <dt>IMDb URL</dt>}
                      {hasImdbId && <dd>
                        <a href={imageImdbUrl(details)}> {"https://www.imdb.com/title/" + details.imdb_id + "/"} </a>
                      </dd>}
                    </dl>
                  </div>
                  : null}
          </div>
        )}
      </div>
    </div>
  )
};

export function MovieSearch(props) {
  const {screen, query, results, title, details, cast, next} = props;

  return screens(next)({screen, results, query, details, cast, title})
}

