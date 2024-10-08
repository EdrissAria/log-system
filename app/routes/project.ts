import router from '@adonisjs/core/services/router'

router.group(() => {
    router.resource('projects', '#controllers/projects_controller')
        .apiOnly()
    router.patch("projects/:id/change-status", "#controllers/projects_controller.changeStatus");
}).prefix("api")