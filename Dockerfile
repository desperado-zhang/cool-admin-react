FROM node:lts-alpine
WORKDIR /build
# 设置npm镜像 + 固定 pnpm 版本（与本地 lockfile 一致）
RUN corepack enable && npm config set registry https://registry.npmmirror.com && corepack prepare pnpm@10.28.2 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /build/
# 禁用发布年龄校验（部分依赖发布不足 24h）
ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0
RUN pnpm install --no-frozen-lockfile
COPY ./ /build
RUN pnpm build

FROM nginx
RUN mkdir /app
COPY --from=0 /build/dist /app
COPY --from=0 /build/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
