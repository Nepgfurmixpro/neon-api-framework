import {
  Body, ContentTypes,
  Controller, headers, Json, Middleware,
  NeonController,
  NeonFramework, NeonMiddleware,
  NeonRequest, NeonResponse,
  Post, Query, Path
} from "neon-api-framework"
import {NeonCors} from "@neon-api-framework/cors";

type TestRequest = {
  item?: string
}

@Controller("/users")
export class Users extends NeonController {
  @Post("/<id>")
  @Json()
  async CreateNewUser(req: NeonRequest, @Path("id") test: string, @Body data: TestRequest) {
    console.log(test)
    return headers({
      "X-Test-Header": "Testing"
    }, {
      data: "value"
    })
  }

  @Post("*/test")
  async NotFound(req: NeonRequest) {
    return "urmom"
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