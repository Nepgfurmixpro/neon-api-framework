import {NeonFramework} from "./NeonAPI";
import {Controller} from "./decorators/controller";
import NeonController from "./NeonController";
import {Post, Get, Json} from "./decorators/methods";
import {Body, Path} from "./decorators/params";
import NeonRequest from "./http/NeonRequest";
import ResponseError from "./errors/ResponseError";

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
      throw new ResponseError(400, {
        message: "ID must be 1",
        code: 1000
      })
    }

    return {
      name, id
    }
  }

  @Get("/@me")
  async GetUser(req: NeonRequest) {

  }

  @Get()
  async GetAllUsers(req: NeonRequest) {

  }
}

@Controller("/saves")
class Saves extends NeonController {
  @Get("recent/<user>")
  GetRecentSave() {

  }
}

NeonFramework.AddRoutes("/api/v1", [
  Users,
  Saves
])

NeonFramework.Listen()