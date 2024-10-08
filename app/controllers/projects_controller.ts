import Project from '#models/project'
import { StatusValidator, StoreValidator, UpdateValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProjectsController {
    public async index({ response }: HttpContext) {
        const projects = await Project.all()
        return response.ok(projects)
      }
    
      public async show({ params, response }: HttpContext) {
        const project = await Project.findOrFail(params.id)
        return response.ok(project)
      }
    
      public async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(StoreValidator)
    
        const project = await Project.create(payload)
        return response.created(project)
      }
    
      public async update({ params, request, response }: HttpContext) {
        const project = await Project.findOrFail(params.id)
        
        const payload = await request.validateUsing(UpdateValidator)
    
        project.merge(payload)
        await project.save()
    
        return response.ok(project)
      }
    
      public async destroy({ params, response }: HttpContext) {
        const project = await Project.findOrFail(params.id)
    
        await project.delete()  
        return response.ok({ message: 'Project deleted successfully' })
      }

      public async changeStatus({ params, request, response }: HttpContext) {    
        const { status } = await request.validateUsing(StatusValidator)
        const project = await Project.findOrFail(params.id)
        
        project.status = status
        await project.save()
        console.log(status)
    
        return response.ok({ message: 'Project status updated successfully', project })
      }
}