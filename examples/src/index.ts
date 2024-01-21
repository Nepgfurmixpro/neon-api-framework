import {Controller, Get, Json, NeonController, NeonFramework, NeonRequest, Path, StatusResponse} from "@neon-api/core"

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