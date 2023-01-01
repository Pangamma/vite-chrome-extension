import React from "react";
import { pages } from "../pages";
import "./app.scss";

const App = () => {
  return (
    <div className="popup">
      <ul>
        {pages.map((page, i: number) => (
          <li key={i}>
            <a href="javascript:void(0);" onClick={() => {
              console.log('onclick popup link: '+page.url);
              chrome.tabs.create({ url: page.url });
            }}>{page.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;
