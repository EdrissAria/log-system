import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { ProjectFactory } from "#database/factories/project_factory";

test.group("project update", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("project updating without any error", async ({ client }) => {
        let project = await ProjectFactory.create()

        let data = {
            name: 'mvgyn',
            logRetentionPeriod: 4294967295,
            maxLogSize: 4294967295,
            contactEmail: 'Rozella75@hotmail.com',
            logLevel: 'debug',
        }

        const response = await client
            .put(`api/projects/${project.id}`)
            .json(data)

        response.assertBodyContains({
            name: data.name,
            logRetentionPeriod: data.logRetentionPeriod,
            maxLogSize: data.maxLogSize,
            contactEmail: data.contactEmail,     
            logLevel: data.logLevel,
            id: Number
        })

        response.assertStatus(200)
    });

    test("project updating with invalid data", async ({ client }) => {
        let project = await ProjectFactory.create()

        const response = await client
            .put(`api/projects/${project.id}`)
            .json({
                name: false,
                logRetentionPeriod: 'sdfs',
                maxLogSize: '9999999999',
                contactEmail: 'ddddddddddddddddddddddd',
                logLevel: false,
            })

        response.assertBodyContains({
            errors: [
              {
                message: 'The name field must be a string',     
                rule: 'string',
                field: 'name'
              },
              {
                message: 'The logRetentionPeriod field must be a number',
                rule: 'number',
                field: 'logRetentionPeriod'
              },
              {
                message: 'The contactEmail field must be a valid email address',
                rule: 'email',
                field: 'contactEmail'
              },
              {
                message: 'The selected logLevel is invalid',    
                rule: 'enum',
                field: 'logLevel',
                meta: {
                         "choices": [
                           "info",
                           "warning",
                           "error",
                           "debug",
                              ],
                       },
              }
            ]
          })
        response.assertStatus(422)

    });

    test("project updating unique name", async ({ client }) => {
        let name = 'my_project'
        let project = await ProjectFactory.create()
        await ProjectFactory.merge({name}).create()

        let data = {
            logRetentionPeriod: 4294967295,
            maxLogSize: 4294967295,
            contactEmail: 'Rozella75@hotmail.com',
            logLevel: 'debug',
        }

        const response = await client
            .put(`api/projects/${project.id}`)
            .json({name, ...data})

        const response2 = await client
            .put(`api/projects/${project.id}`)
            .json({name: project.name, ...data})

        response.assertBodyContains({
            errors: [
              {
                message: 'The name field is not unique',
                rule: 'unique',
                field: 'name'
              }
            ]
          })

          response.assertStatus(422)
        
          response2.assertStatus(200)
    });


});