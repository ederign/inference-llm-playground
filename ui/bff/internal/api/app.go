package api

import (
	"github.com/ederign/inference-llm-playground/internal/config"
	"github.com/julienschmidt/httprouter"
	"log/slog"
	"net/http"
)

const (
	Version = "1.0.0"

	PathPrefix      = "/v1"
	HealthCheckPath = PathPrefix + "/healthcheck"

	//v1/models/sklearn-iris:explain
	ExplainPath = PathPrefix + "/models/:model_explain"
)

type App struct {
	config config.EnvConfig
	logger *slog.Logger
}

func NewApp(cfg config.EnvConfig, logger *slog.Logger) (*App, error) {
	logger.Debug("Initializing app with config", slog.Any("config", cfg))

	app := &App{
		config: cfg,
		logger: logger,
	}
	return app, nil
}

func (app *App) Routes() http.Handler {
	// Router for /api/v1/*
	apiRouter := httprouter.New()

	apiRouter.NotFound = http.HandlerFunc(app.notFoundResponse)
	apiRouter.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	// HTTP client routes
	apiRouter.GET(HealthCheckPath, app.HealthcheckHandler)
	apiRouter.POST(ExplainPath, app.ExplainPostHandler)
	apiRouter.GET(ExplainPath, app.ExplainGetHandler)

	// App Router
	appMux := http.NewServeMux()

	// handler for api calls
	appMux.Handle("/v1/", apiRouter)

	// file server for the frontend file and SPA routes
	//staticDir := http.Dir(app.config.StaticAssetsDir)
	//fileServer := http.FileServer(staticDir)
	//appMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	//	ctxLogger := helper.GetContextLoggerFromReq(r)
	//	// Check if the requested file exists
	//	if _, err := staticDir.Open(r.URL.Path); err == nil {
	//		ctxLogger.Debug("Serving static file", slog.String("path", r.URL.Path))
	//		// Serve the file if it exists
	//		fileServer.ServeHTTP(w, r)
	//		return
	//	}
	//
	//	// Fallback to index.html for SPA routes
	//	ctxLogger.Debug("Static asset not found, serving index.html", slog.String("path", r.URL.Path))
	//	http.ServeFile(w, r, path.Join(app.config.StaticAssetsDir, "index.html"))
	//})

	return app.RecoverPanic(app.EnableCORS(appMux))
}
