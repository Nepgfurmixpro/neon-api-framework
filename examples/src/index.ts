import {
  Body, ContentTypes,
  Controller, html,
  NeonController,
  NeonFramework,
  NeonRequest,
  Path,
  Post, UrlEncoded
} from "neon-api"

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


    return headers({
      "X-Test-Header": "Testing"
    }, {
      data: "value"
    })
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