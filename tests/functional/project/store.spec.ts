import { test } from "@japa/runner";
import testUtils from "@adonisjs/core/services/test_utils";
import { ProjectFactory } from "#database/factories/project_factory";

test.group("project store", (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction());

    test("project storing without any error", async ({ client }) => {
        let data = {
            name: 'mvgyn',
            logRetentionPeriod: 4294967295,
            maxLogSize: 4294967295,
            contactEmail: 'Rozella75@hotmail.com',
            logLevel: 'debug',
        }

        const response = await client
            .post(`api/projects`)
            .json(data)

        response.assertBodyContains({
            name: data.name,
            logRetentionPeriod: data.logRetentionPeriod,
            maxLogSize: data.maxLogSize,
            contactEmail: data.contactEmail,     
            logLevel: data.logLevel,
            id: Number
        })
    });

    test("project storing with no data", async ({ client }) => {

        const response = await client
            .post(`api/projects`)
            .json({})

        response.assertBodyContains({
            errors: [
              {
                message: 'The name field must be defined',      
                rule: 'required',
                field: 'name'
              },
              {
                message: 'The logRetentionPeriod field must be defined',
                rule: 'required',
                field: 'logRetentionPeriod'
              },
              {
                message: 'The maxLogSize field must be defined',      rule: 'required',
                field: 'maxLogSize'
              },
              {
                message: 'The contactEmail field must be defined',
                rule: 'required',
                field: 'contactEmail'
              },
              {
                message: 'The logLevel field must be defined',  
                rule: 'required',
                field: 'logLevel'
              }
            ]
          })

        response.assertStatus(422)
    });

    test("project storing with invalid data", async ({ client }) => {

        const response = await client
            .post(`api/projects`)
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

    test("project storing unique name", async ({ client }) => {
        let name = 'my_project'
        await ProjectFactory.merge({name}).create()

        let data = {
            name,
            logRetentionPeriod: 4294967295,
            maxLogSize: 4294967295,
            contactEmail: 'Rozella75@hotmail.com',
            logLevel: 'debug',
        }

        const response = await client
            .post(`api/projects`)
            .json(data)

        response.assertBodyContains({
            errors: [
              {
                message: 'The name field is not unique',
                rule: 'unique',
                field: 'name'
              }
            ]
          })
    });


});