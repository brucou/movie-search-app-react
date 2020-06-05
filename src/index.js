import "./uikit.css";
import "./index.css";
import { render } from "react-dom";
import h from "react-hyperscript";
import { createStateMachine } from "kingly";
// import { Machine } from "react-state-driven";
import { Machine, getEventEmitterAdapter } from "./Machine";
import { commandHandlers, effectHandlers, movieSearchFsmDef } from "./fsm";
import { events } from "./properties";
import { MovieSearch } from "./MovieSearch";
import {tracer} from "courtesan";
import emitonoff from "emitonoff";

const fsm = createStateMachine(movieSearchFsmDef, {debug:{console},devTool:{tracer}});

render(
  h(
    Machine,
    {
      fsm: fsm,
      eventHandler: getEventEmitterAdapter(emitonoff),
      preprocessor: x => x,
      commandHandlers,
      effectHandlers,
      renderWith: MovieSearch,
      options: { debug: {console}, initialEvent: { [events.USER_NAVIGATED_TO_APP]: void 0 } }
    },
    []
  ),
  document.getElementById("root")
);
