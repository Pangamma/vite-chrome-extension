import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { useLocationProperty, navigate, BaseLocationHook } from "wouter/use-location";
import { routes } from "./routes";


// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";
const hashNavigate = (to) => navigate('#' + to);
const useHashLocation: BaseLocationHook = () => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};

export const App = () => {
  const [location] = useHashLocation();
  let component = <span>404 Not Found</span>;
  const route = routes.find(x => x.url === location);
  if (!!route) component = <route.component />;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {component}
    </Suspense>
  );
}

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  const root = createRoot(appContainer);
  root.render(<App />);
}

init();
