
import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { ProjectFactory } from "#database/factories/project_factory";

test.group("project show", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("one project", async ({ client }) => {
        let project = await ProjectFactory
        .create()
        
        const response = await client
            .get(`api/projects/${project.id}`)
            
        response.assertBodyContains({
            id: project.id,
            name: project.name,
            status: 'active',
            logRetentionPeriod: project.logRetentionPeriod,
            maxLogSize: project.maxLogSize,
            contactEmail: project.contactEmail,
            logLevel: project.logLevel,
        })
    });
});