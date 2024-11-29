# nginx 部署
FROM nginx:1.23.3-alpine as production-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY ./dist /usr/share/nginx/html/dist
EXPOSE 80
## 将/usr/share/nginx/html/dist/assets/index.js 和/usr/share/nginx/html/dist/_app.config.js中的"$vg_base_url"替换为环境变量中的VG_BASE_URL,$vg_sub_domain 替换成VG_SUB_DOMAIN，$vg_default_user替换成VG_DEFAULT_USER，$vg_default_password替换成VG_DEFAULT_PASSWORD 而后启动nginx
CMD sed -i "s|__vg_base_url|$VG_BASE_URL|g" /usr/share/nginx/html/dist/_app.config.js && \
    nginx -g 'daemon off;'
RUN echo "🎉 架 🎉 设 🎉 成 🎉 功 🎉"
