import {ResponseData} from "../utils";

export class StatusResponse {
  constructor(status: number, data: ResponseData) {
    this.status = status
    this.data = data
  }

  status: number
  data: ResponseData
}