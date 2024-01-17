import {NeonFramework} from "./NeonAPI";
import {Controller} from "./decorators/controller";
import NeonController from "./NeonController";
import {Post, Get, Json} from "./decorators/methods";
import {Body, Path} from "./decorators/params";
import NeonRequest from "./http/NeonRequest";
import {html, json, url} from "./http/NeonResponse";
import StatusResponse from "./http/StatusResponse";

type CreateUserReq = {
  email: string
}

@Controller("/users")
class Users extends NeonController {
  @Get("/<id>/<name>")
  @Json()
  async CreateUser(
    req: NeonRequest,
    @Path("id") id: string,
    @Path("name") name: string) {

    if (id != "1") {
      throw new StatusResponse(400, {
        message: "ID must be 1",
        code: 1000
      })
    }

    return {
      name, id
    }
  }

  @Get("/test/shouldBePickedFirst")
  async GetUser(req: NeonRequest) {
    return {
      name: "Gavin",
      gay: true
    }
  }

  @Get()
  async GetAllUsers(req: NeonRequest) {

  }
}

NeonFramework.AddRoutes("/api/v1", [
  Users
])

NeonFramework.Listen()