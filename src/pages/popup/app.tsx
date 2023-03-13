import React from "react";
import { routes } from "../routes";
import "./app.scss";

const App = () => {
  return (
    <div className="popup">
      <ul>
        {routes.map((page, i: number) => (
          <li key={i}>
            <a href="javascript:void(0);" onClick={() => {
              chrome.tabs.create({ url: "/src/pages/index.html#"+page.url });
            }}>{page.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;
