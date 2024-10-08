import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { UserFactory } from "#database/factories/user_factory";

test.group("change password", (group) => {
    group.each.setup(async () => {
        await testUtils.db().withGlobalTransaction();
    });

    test("change password successfully", async ({ client }) => {
        let user = await UserFactory.create()

        const response = await client
            .patch(`api/auth/change-password`)
            .json({
                password: "111"
            })
            .loginAs(user)

        response.assertStatus(200)
        response.assertBodyContains({
            message: "password is updated successfully"
        })

    });

    test("change password invalid fields", async ({ client }) => {
        let user = await UserFactory.create()

        const response = await client
            .patch(`api/auth/change-password`)
            .json({
                password: false,
            })
            .loginAs(user)

        response.assertStatus(422)

        response.assertBodyContains({
            "errors": [
                {
                    "field": "password",
                    "message": "The password field must be a string",
                    "rule": "string",
                }
            ],
        })

    });

});
