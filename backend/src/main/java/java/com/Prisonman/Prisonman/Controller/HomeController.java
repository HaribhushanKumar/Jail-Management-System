package com.Prisonman.Prisonman.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {

    private final RequestMappingHandlerMapping handlerMapping;

    @Autowired
    public HomeController(RequestMappingHandlerMapping handlerMapping) {
        this.handlerMapping = handlerMapping;
    }

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        Set<String> apiEndpoints = handlerMapping.getHandlerMethods().keySet().stream()
                .flatMap(info -> info.getDirectPaths().stream())
                .filter(path -> path.startsWith("/api"))
                .collect(Collectors.toCollection(TreeSet::new));

        StringBuilder endpointsHtml = new StringBuilder();
        for (String endpoint : apiEndpoints) {
            endpointsHtml.append(String.format("""
                <a class="api-item" href="%s" target="_blank">
                    <span class="api-path">%s</span>
                    <span class="api-method">GET</span>
                </a>
                """, endpoint, endpoint));
        }

        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Jail Management System - Backend API</title>
                <style>
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background-color: #ffffff;
                        color: #1e293b;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 40px 20px;
                    }
                    .container {
                        max-width: 640px;
                        width: 100%%;
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 16px;
                        padding: 40px;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
                        text-align: center;
                    }
                    .status-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background-color: #f0fdf4;
                        color: #166534;
                        border: 1px solid #bbf7d0;
                        padding: 6px 16px;
                        border-radius: 9999px;
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 20px;
                    }
                    .dot {
                        width: 8px;
                        height: 8px;
                        background-color: #22c55e;
                        border-radius: 50%%;
                    }
                    h1 {
                        font-size: 28px;
                        font-weight: 700;
                        color: #0f172a;
                        margin-bottom: 8px;
                        letter-spacing: -0.5px;
                    }
                    p.subtitle {
                        font-size: 15px;
                        color: #64748b;
                        margin-bottom: 28px;
                        line-height: 1.5;
                    }
                    .btn-launch {
                        display: inline-block;
                        width: 100%%;
                        background: #2563eb;
                        color: #ffffff;
                        font-weight: 600;
                        font-size: 15px;
                        text-decoration: none;
                        padding: 14px 24px;
                        border-radius: 10px;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                        margin-bottom: 32px;
                    }
                    .btn-launch:hover {
                        background: #1d4ed8;
                        transform: translateY(-1px);
                        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.25);
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: 600;
                        color: #475569;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 16px;
                        text-align: left;
                    }
                    .api-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        text-align: left;
                    }
                    .api-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 16px;
                        background: #f8fafc;
                        border: 1px solid #f1f5f9;
                        border-radius: 8px;
                        text-decoration: none;
                        transition: all 0.2s ease;
                    }
                    .api-item:hover {
                        background: #f1f5f9;
                        border-color: #cbd5e1;
                    }
                    .api-path {
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                        font-size: 14px;
                        font-weight: 600;
                        color: #2563eb;
                    }
                    .api-method {
                        font-size: 12px;
                        font-weight: 700;
                        color: #059669;
                        background: #ecfdf5;
                        padding: 3px 8px;
                        border-radius: 4px;
                        border: 1px solid #a7f3d0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="status-badge">
                        <span class="dot"></span> Backend API Online
                    </div>
                    <h1>Jail Management System</h1>
                    <p class="subtitle">Spring Boot REST API service connected to MongoDB</p>

                    <a href="http://localhost:5173" class="btn-launch">Launch Frontend Dashboard (http://localhost:5173)</a>

                    <div class="section-title">Discovered API Endpoints</div>
                    <div class="api-list">
                        %s
                    </div>
                </div>
            </body>
            </html>
            """, endpointsHtml.toString());
    }
}
