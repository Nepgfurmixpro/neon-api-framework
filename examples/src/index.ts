import {
  Body, ContentTypes,
  Controller, headers, Json, Middleware,
  NeonController,
  NeonFramework, NeonMiddleware,
  NeonRequest, NeonResponse,
  Post
} from "neon-api-framework"

type TestRequest = {
  item?: string
}

class TestMiddleware extends NeonMiddleware {
  override handle(request: NeonRequest, response: NeonResponse): any {
    console.log("closing")
    response.end()
  }
}

@Controller("/users")
export class Users extends NeonController {
  @Post("/create")
  @Json()
  async CreateNewUser(req: NeonRequest, @Middleware(TestMiddleware) testData: any, @Body data: TestRequest) {
    console.log(testData)
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