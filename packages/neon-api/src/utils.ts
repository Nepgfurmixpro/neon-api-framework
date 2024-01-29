import {Route} from "./NeonController";
import colors from "colors";
import { NeonRequest, HTTPMethod} from "./http/NeonRequest";
import {json, ResponseFormatterFunction} from "./http/ResponseData";

function normalize(strArray: string[]) {
  const resultArray = [];
  if (strArray.length === 0) { return ''; }

  if (typeof strArray[0] !== 'string') {
    throw new TypeError('Url must be a string. Received ' + strArray[0]);
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
  }

  for (var i = 0; i < strArray.length; i++) {
    let component = strArray[i];

    if (component === '') { continue; }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^\/+/, '');
    }
    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/\/+$/, '');
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/\/+$/, '/');
    }

    resultArray.push(component);

  }

  var str = resultArray.join('/');
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? in parameters with &
  var parts = str.split('?');
  str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

  return str;
}

export function urlJoin(...input: string[]) {
  return normalize(input);
}

type RoutePrint = {
  method: string,
  path: string,
  fn: string
}

export function formatRoute(route: Route) {
  return formatRoutes([route])[0]
}

export function formatRouteNoColor(route: Route) {
  return formatRoutes([route], false)[0]
}

export function formatRoutes(routes: Route[], color: boolean = true) {
  let out: RoutePrint[] = []
  let longestPath = 0
  routes.forEach((route) => {
    longestPath = Math.max(longestPath, route.path.length)
    out.push({
      method: route.method.toUpperCase(),
      path: route.path,
      fn: [Reflect.get(route.func, "className"), route.func.name].join("."),
    })
  })
  out.forEach((val) => {
    val.path = val.path.padEnd(longestPath, " ")
  })
  return out.map((val) => color ? formatNativeRequest(val.method as HTTPMethod, val.path, val.fn) : formatNativeRequestNoColor(val.method as HTTPMethod, val.path, val.fn))
}

const MethodColors: Record<string, colors.Color> = {
  "post": colors.blue,
  "patch": colors.magenta,
  "put": colors.cyan,
  "get": colors.green,
  "delete": colors.red,
}

export function methodColor(method: string) {
  return MethodColors[method.toLowerCase().trim()](method)
}

export function formatRequest(req: NeonRequest, route?: Route) {
  return formatNativeRequest(req.getMethod(), req.getPath(), route ? [Reflect.get(route.func, "className"), route.func.name].join(".") : undefined)
}

export function formatNativeRequest(method: HTTPMethod, path: string, fn?: string) {
  return `${methodColor(method.padEnd(8, " "))} ${path.underline.blue}${fn ? ` Fn -> ${fn.magenta}` : ""}`
}

export function formatNativeRequestNoColor(method: HTTPMethod, path: string, fn?: string) {
  return `${method.padEnd(8, " ")} ${path}${fn ? ` Fn -> ${fn}` : ""}`
}

export function splitPath(path: string, caseSensitive: boolean = false) {
  const split = path.split("/").filter((val) => val != "")
  return split.map((val) => !caseSensitive ? val.toLowerCase() : val)
}

export const PATH_PARAM_REGEX = /<.*>/

export type PathParam = {
  name: string,
  value: string
}

export function getPathParams(routePath: string, reqPath: string) {
  let out: PathParam[] = []

  const routePathSplit = splitPath(routePath, true)
  const reqPathSplit = splitPath(reqPath, true)

  routePathSplit.forEach((val, i) => {
    if (PATH_PARAM_REGEX.test(val)) {
      const reqPathValue = reqPathSplit[i]
      out.push({
        name: val.slice(1, val.length-1),
        value: reqPathValue
      })
    }
  })

  return out
}

export type ResponseData = ResponseFormatterFunction | object

export function getFunctionFromResponse(funcOrObj: ResponseData) {
  if (typeof funcOrObj === "function") {
    return funcOrObj
  } else {
   return json(funcOrObj)
  }
}