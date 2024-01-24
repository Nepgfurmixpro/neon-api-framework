import {
  Body, ContentTypes,
  Controller, headers, Json,
  NeonController,
  NeonFramework,
  NeonRequest,
  Post, StatusResponse
} from "neon-api"

type TestRequest = {
  item?: string
}

@Controller("/users")
export class Users extends NeonController {
  @Post("/create")
  @Json()
  async CreateNewUser(req: NeonRequest, @Body data: TestRequest) {

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