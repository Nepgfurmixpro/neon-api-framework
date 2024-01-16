import {ResponseData} from "../utils";

export default class ResponseError {
  constructor(status: number, data: ResponseData) {
    this.status = status
    this.data = data
  }

  status: number
  data: ResponseData
}