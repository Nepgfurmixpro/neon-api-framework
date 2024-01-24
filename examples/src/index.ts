import {
  Body, ContentTypes,
  Controller, Json,
  NeonController,
  NeonFramework,
  NeonRequest,
  Path,
  Post, StatusResponse, UrlEncoded
} from "neon-api"

type TestRequest = {
  item?: string
}

class TestRes extends StatusResponse {
  constructor() {
    super(400, {
      test: "test"
    });
  }
}

@Controller("/users")
export class Users extends NeonController {
  @Post("/create")
  @Json()
  CreateNewUser(req: NeonRequest, @Body data: TestRequest) {

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