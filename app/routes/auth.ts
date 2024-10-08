import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel';

router.group(() => {
  router.group(()=>{
    router.post("forgot-password", "#controllers/auth_controller.forgotPassword");
    router.post("reset-password", "#controllers/auth_controller.resetPassword");
    router.post("login", "#controllers/auth_controller.login");
    router.post("register", "#controllers/auth_controller.register");
  })
  
  router.group(() => {
    router.get("info", "#controllers/auth_controller.info")
    router.post("logout", "#controllers/auth_controller.logout")
    router.patch("change-password", "#controllers/auth_controller.changePassword")
  })
  .use(middleware.auth())
})
  .prefix("api/auth")
