import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Task Management API")
    .setDescription("API documentation for the Task Management API")
    .setVersion("1.0")
    .addBearerAuth({
      name: "Authorization",
      bearerFormat: "Bearer",
      scheme: "bearer",
      type: "http",
      in: "Header",
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

export default setupSwagger;
