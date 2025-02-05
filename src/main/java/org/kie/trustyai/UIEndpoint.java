package org.kie.trustyai;

import io.quarkus.qute.Template;
import io.quarkus.qute.TemplateInstance;
import io.quarkus.qute.Location;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/v1/models/{modelName}:ui")
public class UIEndpoint {

    @Inject
    @Location("model-form.html")
    Template modelForm;

    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getUIData(@PathParam("modelName") String modelName) {
        return Response.ok(modelForm.data("modelName", modelName).render()).build();
    }
}