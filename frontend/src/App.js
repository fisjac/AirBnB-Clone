import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsBrowser from "./components/SpotsBrowser";
import SingleSpot from "./components/SingleSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    isLoaded && (
        <>
        <Navigation/>
        <Switch>
          <Route exact path='/'>
            <SpotsBrowser />
          </Route>
          <Route path='/spots/:spotId'>
            <SingleSpot/>
          </Route>
        </Switch>
      </>
      )
  );
}

export default App;
