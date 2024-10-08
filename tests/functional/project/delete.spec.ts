import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { ProjectFactory } from "#database/factories/project_factory";
import Project from "#models/project";

test.group("project delete", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("delete", async ({ client, assert}) => {
        let project = await ProjectFactory.create()
        
        const response = await client
            .delete(`api/projects/${project.id}`)

        response.assertStatus(200)

        let deleted_project = await Project.find(project.id)

        assert.equal(deleted_project, null)

    });
});