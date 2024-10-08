import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { ProjectFactory } from "#database/factories/project_factory";

test.group("project list", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("projects", async ({ client }) => {
        await ProjectFactory.createMany(40)
        
        const response = await client
            .get(`api/projects`)

        response.assertBodyContains([ {
            id: Number,
            name: String,
            status: String,
            logRetentionPeriod: Number,
            maxLogSize: Number,
            contactEmail: String,   
            logLevel: String,
          },])
    });
});