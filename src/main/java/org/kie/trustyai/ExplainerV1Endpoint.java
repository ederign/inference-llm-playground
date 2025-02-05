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

        System.out.println("EDER IS HERE BABY!!!");
        Log.error("EDER IS HERE BABY");
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
            @QueryParam("url") String targetUrl,
            @QueryParam("body") String requestBody,
            @HeaderParam("Host") String hostHeader,
            @HeaderParam("Content-Type") String contentType) {

        if (!isProxy) {
            return Response.ok(modelForm.data("modelName", modelName).render()).build();
        }

        // Handle proxy request
        try {
            Log.info("Proxying request to: " + targetUrl);
            Log.info("With host header: " + hostHeader);
            Log.info("Request body: " + requestBody);

            // Create a client that allows restricted headers
            HttpClient client = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .followRedirects(HttpClient.Redirect.NORMAL)
                    .connectTimeout(Duration.ofSeconds(20))
                    .build();

            // Create request without restricted headers
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .header("Content-Type", contentType != null ? contentType : "application/json")
                    // Remove the Host header - let HttpClient handle it
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody != null ? requestBody : ""))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            Log.info("Proxy response status: " + response.statusCode());
            Log.info("Proxy response body: " + response.body());

            return Response.status(response.statusCode())
                    .entity(response.body())
                    .build();
        } catch (Exception e) {
            Log.error("Proxy error: " + e.getMessage(), e);
            return Response.serverError()
                    .entity("Error: " + e.getMessage())
                    .build();
        }
    }
}
