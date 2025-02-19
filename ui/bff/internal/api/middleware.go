package api

import (
	"context"
	"fmt"
	"github.com/ederign/inference-llm-playground/internal/constants"
	helper "github.com/ederign/inference-llm-playground/internal/helpers"
	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
	"log/slog"
	"net/http"
	"runtime/debug"
)

func (app *App) RecoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				app.serverErrorResponse(w, r, fmt.Errorf("%s", err))
				app.logger.Error("Recovered from panic", slog.String("stack_trace", string(debug.Stack())))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

func (app *App) EnableCORS(next http.Handler) http.Handler {
	fmt.Println("EnableCORS")
	if len(app.config.AllowedOrigins) == 0 {
		// CORS is disabled, this middleware becomes a noop.
		return next
	}

	c := cors.New(cors.Options{
		AllowedOrigins:     app.config.AllowedOrigins,
		AllowCredentials:   true,
		AllowedMethods:     []string{"GET", "PUT", "POST", "PATCH", "DELETE"},
		AllowedHeaders:     []string{constants.KubeflowUserIDHeader, constants.KubeflowUserGroupsIdHeader},
		Debug:              app.config.LogLevel == slog.LevelDebug,
		OptionsPassthrough: false,
	})

	return c.Handler(next)
}

func (app *App) EnableTelemetry(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Adds a unique id to the context to allow tracing of requests
		traceId := uuid.NewString()
		ctx := context.WithValue(r.Context(), constants.TraceIdKey, traceId)

		// logger will only be nil in tests.
		if app.logger != nil {
			traceLogger := app.logger.With(slog.String("trace_id", traceId))
			ctx = context.WithValue(ctx, constants.TraceLoggerKey, traceLogger)

			traceLogger.Debug("Incoming HTTP request", slog.Any("request", helper.RequestLogValuer{Request: r}))
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *App) AttachRESTClient(next func(http.ResponseWriter, *http.Request, httprouter.Params)) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		//modelRegistryID := ps.ByName(ModelRegistryId)
		//
		//namespace, ok := r.Context().Value(constants.NamespaceHeaderParameterKey).(string)
		//if !ok || namespace == "" {
		//	app.badRequestResponse(w, r, fmt.Errorf("missing namespace in the context"))
		//}
		//
		//modelRegistryBaseURL, err := resolveModelRegistryURL(r.Context(), namespace, modelRegistryID, app.kubernetesClient, app.config)
		//if err != nil {
		//	app.notFoundResponse(w, r)
		//	return
		//}
		//
		//// Set up a child logger for the rest client that automatically adds the request id to all statements for
		//// tracing.
		//restClientLogger := app.logger
		//traceId, ok := r.Context().Value(constants.TraceIdKey).(string)
		//if app.logger != nil {
		//	if ok {
		//		restClientLogger = app.logger.With(slog.String("trace_id", traceId))
		//	} else {
		//		app.logger.Warn("Failed to set trace_id for tracing")
		//	}
		//}
		//
		//client, err := integrations.NewHTTPClient(restClientLogger, modelRegistryID, modelRegistryBaseURL)
		//if err != nil {
		//	app.serverErrorResponse(w, r, fmt.Errorf("failed to create Kubernetes client: %v", err))
		//	return
		//}
		//ctx := context.WithValue(r.Context(), constants.ModelRegistryHttpClientKey, client)
		next(w, r.WithContext(r.Context()), ps)
	}
}
