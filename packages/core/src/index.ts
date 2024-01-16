import {NeonFramework} from "./NeonAPI";
import {Controller} from "./decorators/controller";
import NeonController from "./NeonController";
import {Post, Get, Json} from "./decorators/methods";
import {Body, Path} from "./decorators/params";

type CreateUserReq = {
  email: string
}

@Controller("/users")
class Users extends NeonController {
  @Post("/<id>/<name>")
  @Json()
  async CreateUser(
    req: string,
    @Path("id") id: string,
    @Path("name") name: string,
    @Body body: CreateUserReq) {

  }

  @Get("/@me")
  async GetUser(req: string) {

  }

  @Get()
  async GetAllUsers(req: string) {

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