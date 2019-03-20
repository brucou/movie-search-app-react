import "./uikit.css";
import "./index.css";
import { render } from "react-dom";
import h from "react-hyperscript";
import { createStateMachine } from "state-transducer";
import { Machine } from "react-state-driven";
// import { Machine } from "./Machine";
import { commandHandlers, effectHandlers, movieSearchFsmDef } from "./fsm";
import { eventEmitterAdapter } from "./helpers";
import { events } from "./properties";
import { MovieSearch } from "./MovieSearch";

const fsm = createStateMachine(movieSearchFsmDef);

render(
  h(
    Machine,
    {
      fsm: fsm,
      eventHandler: eventEmitterAdapter(),
      preprocessor: x => x,
      commandHandlers,
      effectHandlers,
      renderWith: MovieSearch,
      options: { initialEvent: { [events.USER_NAVIGATED_TO_APP]: void 0 } }
    },
    []
  ),
  document.getElementById("root")
);
