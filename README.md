# Weather Forecast App

User is able to get the weather forecast for a given town. This Vue 3 application uses a free weather API. The results are shown in a chart and as a list component.

## Launching the application locally using Docker with Hot-Reload functionality

Building an image:

```sh
docker-compose build
```

Running the application:

```sh
docker-compose up
```

## Environment variables

Create an `.env` file based on an `.env.example` file if you want to change the default values defined in a `src/utils/configuration.ts` file.
