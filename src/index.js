import "./uikit.css";
import "./index.css";
import { render } from "react-dom";
import React from "react";
import { createStateMachine } from "kingly";
import { Machine } from "./Machine";
// import { Machine } from "react-state-driven";
import { commandHandlers, effectHandlers, movieSearchFsmDef } from "./fsm";
import { MovieSearch } from "./MovieSearch";
// We trace the machine with the devtool
// cf. https://brucou.github.io/documentation/v1/tooling/devtool.html
import { tracer } from "courtesan";

const fsm = createStateMachine(movieSearchFsmDef, { devTool: { tracer } });

render(
  <Machine
    fsm={fsm}
    // `eventHandler` is optional and default to
    // a minimal (300B), synchronous event emitter (emitonoff)
    // eventHandler={getEventEmitterAdapter(emitonoff)}
    // preprocessor={x => x} // optional, defaults to x => x
    commandHandlers={commandHandlers} // mandatory
    // effectHandlers={effectHandlers} // optional, defaults to {}
    renderWith={MovieSearch}
    // `initialEvent` is optional and default to MOUNTED (exported by Machine)
    // options={{ initialEvent: { [events.USER_NAVIGATED_TO_APP]: void 0 } }}
  />,
  document.getElementById("root")
);
