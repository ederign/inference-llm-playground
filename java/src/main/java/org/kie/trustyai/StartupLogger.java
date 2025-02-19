package org.kie.trustyai;

import io.quarkus.logging.Log;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class StartupLogger {

    void onStart(@Observes StartupEvent ev) {
        Log.info("========================================");
        Log.info("Infernce LLM chatbot starting...");
        Log.info("Version: 0.25");
        Log.info("========================================");
    }
}