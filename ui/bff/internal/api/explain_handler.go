package api

import (
	"fmt"
	"log/slog"
	"net/http"
	"path"

	helper "github.com/ederign/inference-llm-playground/internal/helpers"
	"github.com/julienschmidt/httprouter"
)

func (app *App) ExplainPostHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	//model := ps.ByName("model")
	model := "dora"

	fmt.Println("ExplainPostHandler")
	fmt.Println(app.config.PredictorHost)
	fmt.Println(app.config.PredictorHttpPort)

	// //create http client
	// baseURL := "https://granite-8b-code-instruct-maas-apicast-production.apps.prod.rhoai.rh-aiservices-bu.com:443"
	// _, err := integrations.NewHTTPClient(app.logger, baseURL)
	// if err != nil {
	// 	app.serverErrorResponse(w, r, fmt.Errorf("failed to create Kubernetes client: %v", err))
	// 	return
	// }

	// // Fixed response for testing
	// response := map[string]interface{}{
	// 	"model":       model,
	// 	"status":      "success",
	// 	"explanation": "This is a test explanation response for model inference.",
	// }

	// Log the request
	app.logger.Debug("Returning fixed JSON response", slog.String("model", model))

	// Set JSON response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and send response
	//json.NewEncoder(w).Encode(response)
}

func (app *App) ExplainGetHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	staticDir := http.Dir(app.config.StaticAssetsDir)
	fileServer := http.FileServer(staticDir)
	ctxLogger := helper.GetContextLoggerFromReq(r)

	//model := ps.ByName("model")
	model := "dora"
	app.logger.Debug("ExplainGetHandler", slog.String("model", model))

	if _, err := staticDir.Open(r.URL.Path); err == nil {
		ctxLogger.Debug("Serving static file", slog.String("path", r.URL.Path))
		// Serve the file if it exists
		fileServer.ServeHTTP(w, r)
		return
	}

	ctxLogger.Debug("Static asset not found, serving index.html", slog.String("path", r.URL.Path))
	http.ServeFile(w, r, path.Join(app.config.StaticAssetsDir, "index.html"))
}
