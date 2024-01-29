import {
  Body, ContentTypes,
  Controller, headers, Json, Middleware,
  NeonController,
  NeonFramework, NeonMiddleware,
  NeonRequest, NeonResponse,
  Post, Query
} from "neon-api-framework"

type TestRequest = {
  item?: string
}

@Controller("/users")
export class Users extends NeonController {
  @Post("/create")
  @Json()
  async CreateNewUser(req: NeonRequest, @Query("test") test: string, @Body data: TestRequest) {
    console.log(test)
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