import express from "express";

export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;
  abstract configureRoutes(): express.Application;

  constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    this.configureRoutes();
  }

  getName() {
    return this.name;
  }
}
