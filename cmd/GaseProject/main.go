package main

import (
	_ "WEB/docs"
	"WEB/internal/app/config"
	"WEB/internal/app/dsn"
	"WEB/internal/app/handler"
	"WEB/internal/app/repository"
	"WEB/internal/pkg"
	"fmt"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title GaseProject API
// @version 1.0
// @description API для управления газами и расчетами

// @contact.name API Support
// @contact.url http://localhost:8080
// @contact.email support@gaseproject.com

// @license.name MIT

// @host localhost:8080
// @BasePath /
// @schemes http

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description JWT Token
func main() {
	router := gin.Default()

	// Настраиваем CORS middleware
	// Используем AllowOriginFunc для поддержки динамических IP адресов и GitHub Pages
	router.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Разрешаем запросы без Origin (например, из Tauri или прямые запросы)
			if origin == "" {
				logrus.Debug("CORS: Allowing request without Origin header")
				return true
			}

			logrus.Debugf("CORS: Checking origin: %s", origin)

			// Разрешаем localhost и 127.0.0.1 на любых портах (HTTP и HTTPS)
			if strings.HasPrefix(origin, "http://localhost:") ||
				strings.HasPrefix(origin, "https://localhost:") ||
				strings.HasPrefix(origin, "http://127.0.0.1:") ||
				strings.HasPrefix(origin, "https://127.0.0.1:") {
				return true
			}

			// Разрешаем локальные IP адреса (192.168.x.x, 10.x.x.x, 172.16-18.x.x) по HTTP
			// Проверяем паттерны локальных сетей
			if strings.HasPrefix(origin, "http://192.168.") ||
				strings.HasPrefix(origin, "http://10.") ||
				strings.HasPrefix(origin, "http://172.16.") ||
				strings.HasPrefix(origin, "http://172.17.") ||
				strings.HasPrefix(origin, "http://172.18.") {
				return true
			}

			// Разрешаем GitHub Pages домены (https://*.github.io)
			// Это позволяет запросам с GitHub Pages работать
			if strings.Contains(origin, ".github.io") {
				return true
			}

			// Разрешаем все HTTPS запросы (для безопасности можно ограничить конкретными доменами)
			// В production лучше указать конкретные домены
			if strings.HasPrefix(origin, "https://") {
				return true
			}

			return false
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"HEAD",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Length",
			"Content-Type",
			"Authorization",
			"Accept",
			"X-Requested-With",
		},
		ExposeHeaders: []string{
			"Content-Length",
			"Content-Type",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Добавляем Swagger
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	conf, err := config.NewConfig()
	if err != nil {
		logrus.Fatalf("error loading config: %v", err)
	}

	postgresString := dsn.FromEnv()
	fmt.Println(postgresString)

	rep, err := repository.New(postgresString)
	if err != nil {
		logrus.Fatalf("error initializing repository: %v", err)
	}

	hand := handler.NewHandler(rep)

	application, err := pkg.NewApp(conf, router, hand, rep)
	if err != nil {
		logrus.Fatalf("error creating application: %v", err)
	}

	application.RunApp()
}
