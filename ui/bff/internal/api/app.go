package api

import (
	"log/slog"
	"net/http"
	"path"
	"strings"

	"github.com/ederign/inference-llm-playground/internal/config"
	helper "github.com/ederign/inference-llm-playground/internal/helpers"
	"github.com/julienschmidt/httprouter"
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

	//file server for the frontend file and SPA routes
	staticDir := http.Dir(app.config.StaticAssetsDir)
	fileServer := http.FileServer(staticDir)

	// Handle assets directory explicitly
	appMux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir(path.Join(app.config.StaticAssetsDir, "assets")))))

	// Handle root and other paths
	appMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ctxLogger := helper.GetContextLoggerFromReq(r)

		// Log all incoming requests to help debug
		ctxLogger.Debug("Received request",
			slog.String("path", r.URL.Path),
			slog.String("method", r.Method))

		// Check if the requested file exists
		if _, err := staticDir.Open(r.URL.Path); err == nil {
			ctxLogger.Debug("Serving static file", slog.String("path", r.URL.Path))
			// Serve the file if it exists
			fileServer.ServeHTTP(w, r)
			return
		}

		// Fallback to index.html for SPA routes
		ctxLogger.Debug("Static asset not found, serving index.html", slog.String("path", r.URL.Path))
		http.ServeFile(w, r, path.Join(app.config.StaticAssetsDir, "index.html"))
	})

	// Add this handler to catch assets requested from any path
	appMux.HandleFunc("/v1/models/assets/", func(w http.ResponseWriter, r *http.Request) {
		// Redirect or rewrite the request to the correct assets path
		newPath := strings.Replace(r.URL.Path, "/v1/models/assets/", "/assets/", 1)
		ctxLogger := helper.GetContextLoggerFromReq(r)
		ctxLogger.Debug("Redirecting asset request",
			slog.String("from", r.URL.Path),
			slog.String("to", newPath))

		// Option 1: Redirect (client-side)
		http.Redirect(w, r, newPath, http.StatusMovedPermanently)

		// Option 2: Rewrite and serve (server-side)
		// newReq := r.Clone(r.Context())
		// newReq.URL.Path = newPath
		// http.StripPrefix("/assets/", http.FileServer(http.Dir(path.Join(app.config.StaticAssetsDir, "assets")))).ServeHTTP(w, newReq)
	})

	return app.RecoverPanic(app.EnableCORS(appMux))
}
