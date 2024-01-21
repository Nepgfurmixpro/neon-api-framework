import {NeonController} from "../NeonController";

export function Controller(basePath: string = "/") {
  return (targetPrototype: typeof NeonController) => {
    Reflect.set(targetPrototype, "basePath", basePath)
  }
}