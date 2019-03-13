import superagent from "superagent";
import emitonoff from "emitonoff";

// Helpers
export const SvcUrl = relativeUrl =>
  relativeUrl
    .replace(/^/, "https://api.themoviedb.org/3")
    .replace(/(\?|$)/, "?api_key=bf6b860ab05ac2d94054ba9ca96cf1fa&");

export function runMovieSearchQuery(query) {
  return superagent.get(SvcUrl(query)).then(res => {
    return res.body;
  });
}

export function runMovieDetailQuery(movieId) {
  return Promise.all([
    runMovieSearchQuery(`/movie/${movieId}`),
    runMovieSearchQuery(`/movie/${movieId}/credits`)
  ]);
}

export function makeQuerySlug(query) {
  return query.length === 0
    ? `/movie/popular?language=en-US&page=1`
    : `/search/movie?query=${query}`;
}

// Utils
export function destructureEvent(eventStruct) {
  return {
    rawEventName: eventStruct[0],
    rawEventData: eventStruct[1],
    ref: eventStruct[2]
  };
}

export function tryCatch(fn, errCb) {
  return function tryCatch(...args) {
    try {
      return fn.apply(fn, args);
    } catch (e) {
      return errCb(e, args);
    }
  };
}

/**
 *
 * @param {{console, debugEmitter, connection}} debug
 * @param errMsg
 * @returns {logAndRethrow}
 */
export const logAndRethrow = function logAndRethrowCurried(debug, errMsg) {
  // TODO : I should also catch errors occuring there and pass it to the debugEmitter
  return function logAndRethrow(e, args) {
    debug &&
      debug.console &&
      debug.console.error(`logAndRethrow :> errors`, errMsg, e);
    debug &&
      debug.console &&
      debug.console.error(`logAndRethrow :> args `, args);
    throw e;
  };
};

export function identity(x) {
  return x;
}

export const eventEmitterAdapter = () => {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const _ = DUMMY_NAME_SPACE;
  const subscribers = [];
  const subscribeFn = function(f) {
    return subscribers.push(f), eventEmitter.on(_, f);
  };

  return {
    subjectFactory: () => ({
      next: x => eventEmitter.emit(_, x),
      complete: () => subscribers.forEach(f => eventEmitter.off(_, f)),
      subscribe: subscribeFn
    }),
    // NOTE : Observer is assumed to be always a triple {next, error, complete} even though
    // for a standard event emitter, there is not really an error channel...
    subscribe: (observable, observer) => observable.subscribe(observer.next)
  };
};
