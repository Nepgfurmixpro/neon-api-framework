import {
  Body, ContentTypes,
  Controller,
  NeonController,
  NeonFramework,
  NeonRequest,
  Path,
  Post, UrlEncoded
} from "@neon-api/core"

type TestRequest = {
  item?: string
}

@Controller("/users")
class Users extends NeonController {
  @Post("/<id>/<name>")
  @UrlEncoded()
  async CreateUser(
    req: NeonRequest,
    @Path("id") id: string,
    @Path("name") name: string,
    @Body data: TestRequest) {

    console.log(data.item)

    return {
      name, id
    }
  }
}

NeonFramework.AddRoutes("/api/v1", [
  Users
])

NeonFramework.RegisterContentTypes(
  ContentTypes.Json,
  ContentTypes.UrlEncoded
)

NeonFramework.Listen()