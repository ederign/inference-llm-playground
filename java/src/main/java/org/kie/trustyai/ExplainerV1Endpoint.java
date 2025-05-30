package org.kie.trustyai;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import io.quarkus.qute.Location;
import io.quarkus.qute.Template;
import io.quarkus.qute.TemplateInstance;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.logging.Log;
import jakarta.enterprise.inject.Default;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;
import org.kie.trustyai.connectors.kserve.v1.KServeV1HTTPPredictionProvider;
import org.kie.trustyai.connectors.kserve.v1.KServeV1RequestPayload;
import org.kie.trustyai.explainability.model.Prediction;
import org.kie.trustyai.explainability.model.PredictionInput;
import org.kie.trustyai.explainability.model.PredictionOutput;
import org.kie.trustyai.explainability.model.PredictionProvider;
import org.kie.trustyai.explainability.model.SaliencyResults;
import org.kie.trustyai.explainability.model.SimplePrediction;
import org.kie.trustyai.payloads.SaliencyExplanationResponse;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.core.JsonProcessingException;

@Path("/v1/models/{modelName}:explain")
public class ExplainerV1Endpoint {

    @Inject
    @Default
    ConfigService configService;

    @Inject
    CommandLineArgs cmdArgs;

    @Inject
    ExplainerFactory explainerFactory;

    @Inject
    StreamingGeneratorManager streamingGeneratorManager;

    @Inject
    @Location("model-form.html")
    Template modelForm;

    @PostConstruct
    void init() {
        Log.info("========================================");
        Log.info("TrustyAI Explainer Endpoint Initialized");
        Log.info("Version: v7.0.0-SNAPSHOT");
        Log.info("========================================");
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response explain(@PathParam("modelName") String modelName, KServeV1RequestPayload data)
            throws ExecutionException, InterruptedException {

        Log.info("Using fsdfsdds type [" + configService.getExplainerType() + "]");
        Log.info("Using V1 HTTP protocol");
        final String predictorURI = cmdArgs.getV1HTTPPredictorURI(modelName);
        final PredictionProvider provider = new KServeV1HTTPPredictionProvider(null, null, predictorURI, 1);
        Log.info("Using predictor URI [" + predictorURI + "]");

        final List<PredictionInput> input = data.toPredictionInputs();
        final PredictionOutput output = provider.predictAsync(input).get().get(0);
        final Prediction prediction = new SimplePrediction(input.get(0), output);
        final int dimensions = input.get(0).getFeatures().size();
        final ExplainerType explainerType = configService.getExplainerType();

        CompletableFuture<SaliencyResults> lime = null;
        CompletableFuture<SaliencyResults> shap = null;

        if (explainerType == ExplainerType.SHAP || explainerType == ExplainerType.ALL) {
            if (Objects.isNull(streamingGeneratorManager.getStreamingGenerator())) {
                Log.info("Initializing SHAP's Streaming Background Generator with dimension " + dimensions);
                streamingGeneratorManager.initialize(dimensions);
            }
            final double[] numericData = new double[dimensions];
            for (int i = 0; i < dimensions; i++) {
                numericData[i] = input.get(0).getFeatures().get(i).getValue().asNumber();
            }
            final RealVector vectorData = new ArrayRealVector(numericData);
            streamingGeneratorManager.getStreamingGenerator().update(vectorData);
            shap = explainerFactory.getExplainer(ExplainerType.SHAP)
                    .explainAsync(prediction, provider);
        }

        if (explainerType == ExplainerType.LIME || explainerType == ExplainerType.ALL) {
            Log.info("Sending explaining request to " + predictorURI);
            lime = explainerFactory.getExplainer(ExplainerType.LIME)
                    .explainAsync(prediction, provider);
        }

        try {
            Log.info("Sending explaining request to " + predictorURI);
            if (explainerType == ExplainerType.ALL) {
                CompletableFuture<SaliencyExplanationResponse> response = lime.thenCombine(shap,
                        SaliencyExplanationResponse::fromSaliencyResults);
                return Response.ok(response.get(), MediaType.APPLICATION_JSON).build();
            } else if (explainerType == ExplainerType.SHAP) {
                return Response.ok(shap.get(), MediaType.APPLICATION_JSON).build();
            } else if (explainerType == ExplainerType.LIME) {
                return Response.ok(lime.get(), MediaType.APPLICATION_JSON).build();
            } else {
                return Response.serverError().entity("Unsupported explainer type").build();
            }
        } catch (IllegalArgumentException e) {
            return Response.serverError().entity("Error: " + e.getMessage()).build();
        }

    }

    @GET
    @Produces({ MediaType.TEXT_HTML, MediaType.APPLICATION_JSON })
    public Response getUIData(
            @PathParam("modelName") String modelName,
            @QueryParam("proxy") @DefaultValue("false") boolean isProxy,
            @QueryParam("message") String userMessage,
            @QueryParam("url") String targetUrl,
            @QueryParam("body") String requestBody,
            @HeaderParam("Host") String hostHeader,
            @HeaderParam("Content-Type") String contentType) throws ExecutionException, InterruptedException {

        Log.info("isProxy: " + isProxy);
        Log.info("userMessage: " + userMessage);
        Log.info("targetUrl: " + targetUrl);
        Log.info("requestBody: " + requestBody);
        Log.info("hostHeader: " + hostHeader);
        Log.info("contentType: " + contentType);

        if (isProxy) {
            try {
                // Create HTTP client
                HttpClient client = HttpClient.newBuilder()
                        .connectTimeout(Duration.ofSeconds(30))
                        .build();

                // Prepare request body for chat completion
                Map<String, Object> requestMap = new HashMap<>();
                requestMap.put("model", "granite-5");

                // Create the messages array with a single user message
                List<Map<String, String>> messages = new ArrayList<>();
                Map<String, String> userMessageMap = new HashMap<>();
                userMessageMap.put("role", "user");
                userMessageMap.put("content", userMessage != null ? userMessage : "Hello");
                messages.add(userMessageMap);
                requestMap.put("messages", messages);

                ObjectMapper mapper = new ObjectMapper();
                String requestJson = mapper.writeValueAsString(requestMap);

                // Log the request
                Log.info("Request JSON: " + requestJson);

                // String url =
                // "https://gpt2-eder-llm.apps.prod.rhoai.rh-aiservices-bu.com/v1/completions";
                // Create HTTP request
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(targetUrl))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                        .build();

                // Send request and get response
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                // Log the raw response
                Log.info("Response Status: " + response.statusCode());
                Log.info("Raw Response: " + response.body());

                // Parse response to get the content from the assistant's message
                Map<String, Object> responseMap = mapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");

                if (choices == null || choices.isEmpty()) {
                    Log.error("No choices found in response");
                    return Response.serverError().entity("No response from model").build();
                }

                // Extract the message content from the first choice
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                String aiResponse = message != null ? (String) message.get("content") : "";
                Log.info("AI Response Text: " + aiResponse);

                // Create response object
                Map<String, Object> predictionData = new HashMap<>();
                predictionData.put("message", aiResponse);
                // predictionData.put("userMessage", userMessage);

                // Return JSON or HTML based on content type
                if (contentType != null && contentType.contains(MediaType.APPLICATION_JSON)) {
                    String jsonResponse = mapper.writeValueAsString(predictionData);
                    return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
                }

                return Response.ok(
                        modelForm.data("modelName", modelName)
                                .render())
                        .build();

            } catch (Exception e) {
                Log.error("Error processing request: " + e.getMessage(), e);
                Log.error("Stack trace:", e);
                return Response.serverError().entity("Error processing request: " + e.getMessage()).build();
            }
        } else {
            return Response.ok(
                    modelForm.data("modelName", modelName)
                            .render())
                    .build();
        }
    }
}
