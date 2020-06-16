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

/**
 *
 * @param {{console, debugEmitter, connection}} debug
 * @param errMsg
 * @returns {logError}
 */
export const logError = function logErrorCurried(debug, errMsg) {
  return function logError(e, args) {
    debug &&
    debug.console &&
    debug.console.error(`An error occurred while executing: `, errMsg, args, e);
  };
};

export const getStateTransducerRxAdapter = RxApi => {
  const { Subject } = RxApi;

  return new Subject();
};

export const getEventEmitterAdapter = emitonoff => {
  const eventEmitter = emitonoff();
  const DUMMY_NAME_SPACE = "_";
  const subscribers = [];

  const subject = {
    next: x => {
      try {
        eventEmitter.emit(DUMMY_NAME_SPACE, x);
      } catch (e) {
        subject.error(e);
      }
    },
    error: e => {
      throw e;
    },
    complete: () =>
      subscribers.forEach(f => eventEmitter.off(DUMMY_NAME_SPACE, f)),
    subscribe: ({ next: f, error: errFn, complete: __ }) => {
      subscribers.push(f);
      eventEmitter.on(DUMMY_NAME_SPACE, f);
      subject.error = errFn;
      return { unsubscribe: subject.complete };
    }
  };
  return subject;
};
