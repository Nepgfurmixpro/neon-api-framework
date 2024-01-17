import {ResponseData} from "../utils";

export default class StatusResponse {
  constructor(status: number, data: ResponseData) {
    this.status = status
    this.data = data
  }

  status: number
  data: ResponseData
}