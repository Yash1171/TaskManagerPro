package routes

import (
	"yashbackend/controllers"
	"yashbackend/middleware"
	"github.com/gin-gonic/gin"
)

func TaskRoutes(r *gin.Engine) {
	protected := r.Group("/tasks")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/", controllers.GetTasks)
		protected.POST("/", controllers.CreateTask)
		protected.PUT("/:id", controllers.UpdateTask)
		protected.DELETE("/:id", controllers.DeleteTask)
	}
}
