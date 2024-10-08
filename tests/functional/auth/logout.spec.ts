import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { UserFactory } from "#database/factories/user_factory";

test.group("user logout", (group) => {
    group.each.setup(async () => {
        await testUtils.db().withGlobalTransaction()
    });

    test("logout", async ({ client }) => {
        let user = await UserFactory.create()

        let response = await client
            .post(`api/auth/logout`)
            .loginAs(user)

        response.assertBody({ logout: true })
        
    });

});
