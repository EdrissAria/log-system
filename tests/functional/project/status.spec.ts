import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { ProjectFactory } from "#database/factories/project_factory";
import Project from "#models/project";

test.group("project change status", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("change status", async ({ client, assert}) => {
        let project = await ProjectFactory
        .create()
        
        let status = 'inactive'

        await client
            .patch(`api/projects/${project.id}/change-status`)
            .json({status})

        let d_project = await Project.findOrFail(project.id)

        assert.equal(d_project.status, status)
    });
});