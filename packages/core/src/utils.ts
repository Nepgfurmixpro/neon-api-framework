import {Route} from "./NeonController";
import colors from "colors";

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

export function formatRoutes(routes: Route[]) {
  let out: RoutePrint[] = []
  let longestPath = 0
  routes.forEach((route) => {
    longestPath = Math.max(longestPath, route.path.length)
    out.push({
      method: route.method.toUpperCase(),
      path: route.path,
      fn: route.func.name
    })
  })
  out.forEach((val) => {
    val.path = val.path.padEnd(longestPath, " ")
  })
  return out
}

const MethodColors: Record<string, colors.Color> = {
  "post": colors.blue,
  "get": colors.green,
  "delete": colors.red
}

export function methodColor(method: string) {
  return MethodColors[method.toLowerCase().trim()](method)
}

export function splitPath(path: string) {
  const split = path.split("/")
  split.shift()
  return split
}

export const PATH_PARAM_REGEX = /<.*>/

export type PathParam = {
  name: string,
  value: string
}

export function getPathParams(routePath: string, reqPath: string) {
  let out: PathParam[] = []

  const routePathSplit = splitPath(routePath)
  const reqPathSplit = splitPath(reqPath)

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