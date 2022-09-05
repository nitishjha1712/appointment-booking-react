import React, { useState } from 'react';
import './App.css';
import Bookevent from './components/Bookevent';
import Showevent from './components/Showevent';
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

const TimezoneContext = React.createContext(null);

function App() {
  const [timezone, setTimezone] = useState();
  try{
    return (
      <TimezoneContext.Provider value={[timezone, setTimezone]}>
        <Router>
          <Routes>
              <Route path="/" element={<Bookevent />} />
              <Route path="show-events" element={<Showevent />} />
          </Routes>
        </Router>
      </TimezoneContext.Provider>
    );
  } catch(err){
    console.log("Error", err);
  }
}

export {App, TimezoneContext};
