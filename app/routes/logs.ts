import router from '@adonisjs/core/services/router'

router.group(() => {
    router.get("", "#controllers/logs_controller.index");
}).prefix("api/logs")