import { test } from "@japa/runner";
import { UserFactory } from "#database/factories/user_factory";
import testUtils from "@adonisjs/core/services/test_utils";

test.group("user auth info", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("user info", async ({ client }) => {
        let user = await UserFactory.create()

        const response = await client
            .get(`api/auth/info`)
            .loginAs(user)

        response.assertBodyContains({
            user: {
              id: Number,
              fullname: String,
              job: String ?? null,
              country: String ?? null,
              username: String,
              email: String,
              rememberMeToken: String ?? null,
              createdAt: Date,
              updatedAt: Date 
            }
          })
    });

});
