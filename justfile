set shell := ["pwsh.exe", "-NoLogo", "-Command"]

a app +pkgs:
    pnpm --filter {{ app }} add {{ pkgs }}
ad app +pkgs:
    pnpm --filter {{ app }} add -D {{ pkgs }}
r app +pkgs:
    pnpm --filter {{ app }} remove {{ pkgs }}
prisma-dev:
    pnpm --filter api exec prisma migrate dev && pnpm --filter api exec prisma generate
seed-dev:
	pnpm --filter api exec prisma db seed -- --environment development
docker-dev:
    docker compose -f docker-compose.dev.yml up -d --build
docker-test:
    docker compose -f docker-compose.test.yml up -d --build
be-d:
	pnpm --filter api dev
