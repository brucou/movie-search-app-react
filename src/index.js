// cf. https://frontarm.com/demoboard/?id=9afd2d8c-7b0a-46ce-9595-0acc03132eec
import "./uikit.css";
import "./index.css";
import { render } from "react-dom";
import h from "react-hyperscript";
import { createStateMachine, fsmContracts } from "state-transducer";
import { Machine } from "react-state-driven";
// import { Machine } from "./Machine";
import { commandHandlers, effectHandlers, movieSearchFsmDef } from "./fsm";
import { eventEmitterAdapter } from "./helpers";
import { events } from "./properties";
import { MovieSearch } from "./MovieSearch";

const fsm = createStateMachine(movieSearchFsmDef, { debug: { console, checkFsmContracts: fsmContracts } });

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
