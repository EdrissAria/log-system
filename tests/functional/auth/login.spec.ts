import { test } from "@japa/runner";
import { UserFactory } from "#database/factories/user_factory";
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Users login', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())

    test("login with username", async ({ client }) => {
        let password = "123"

        let user = await UserFactory
            .merge({ password }).create()

        const response = await client
            .post(`api/auth/login`)
            .json({
                uids: user.username,
                password
            })

        response.assertBodyContains({
            type: 'bearer',
            token: String
        })

    });

    test("login with email", async ({ client }) => {
        let password = "123"

        let user = await UserFactory
            .merge({ password }).create()

        const response = await client
            .post(`api/auth/login`)
            .json({
                uids: user.email,
                password
            })

        response.assertBodyContains({
            type: 'bearer',
            token: String
        })

    });

    test("invalid username or email", async ({ client }) => {
        let password = "123"

        await UserFactory
            .merge({ password }).create()


        const response = await client
            .post(`api/auth/login`)
            .json({
                uids: "111111111111111111111111",
                password: password
            })

        response.assertBody(
            { errors: [{ message: 'Invalid user credentials' }] }
        )

    });

    test("invalid password", async ({ client }) => {

        let user = await UserFactory.create()

        const response = await client
            .post(`api/auth/login`)
            .json({
                uids: user.username,
                password: "123"
            })

        response.assertBody(
            { errors: [{ message: 'Invalid user credentials' }] }
        )

    });

    test("invalid password and (username or email)", async ({ client }) => {

        const response = await client
            .post(`api/auth/login`)
            .json({
                uids: "11111111111111111111111111111111",
                password: "gggggggggggggggggggggggggggggggggggggggggg"
            })

        response.assertBody(
            { errors: [{ message: 'Invalid user credentials' }] }
        )

    });

    test("invalid body", async ({ client }) => {

        const response = await client
            .post(`api/auth/login`)
            .json({
                uids: false,
                password: 3234234
            })

        response.assertBody(
            {
                errors: [
                    {
                        message: 'The uids field must be a string',
                        rule: 'string',
                        field: 'uids'
                    },
                    {
                        message: 'The password field must be a string',
                        rule: 'string',
                        field: 'password'
                    }
                ]
            }
        )

    });
});
