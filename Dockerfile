FROM node:lts-alpine AS base
WORKDIR /app
# inject all needed environment variables
ARG VITE_GEOCODING_API_BASE_URL \
VITE_FORECAST_API_BASE_URL
ENV VITE_GEOCODING_API_BASE_URL=$VITE_GEOCODING_API_BASE_URL \
VITE_FORECAST_API_BASE_URL=$VITE_FORECAST_API_BASE_URL
COPY package*.json ./

RUN npm install
COPY . .

FROM base AS dev
EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]