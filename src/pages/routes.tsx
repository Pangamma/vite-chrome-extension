import React from "react";
import { ComponentType, LazyExoticComponent } from "react";

export interface AppRoute {
  text: string;
  url: string;
  component?: LazyExoticComponent<ComponentType<any>>;
}

function _(text: string, url: string, compImport?: (() => Promise<{ default: React.ComponentType<any>;}>)): AppRoute {
  return {
    text, url, component: React.lazy(compImport)
  };
}

export const routes = [
  _("DeploymentWatcher", "/deploymentWatcher", () => import("@pages/deployment-watcher/app"))
];