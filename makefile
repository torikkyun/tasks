check:
	@test -n "$(app)" || (echo "Missing app"; exit 1)
	@test -n "$(pkgs)" || (echo "Missing pkgs"; exit 1)

a: check
	pnpm --filter $(app) add $(pkgs)

ad: check
	pnpm --filter $(app) add -D $(pkgs)

r: check
	pnpm --filter $(app) remove $(pkgs)

prisma-dev:
	pnpm --filter api exec prisma migrate dev && pnpm --filter api exec prisma generate
seed-dev:
	pnpm --filter api exec prisma db seed -- --environment development
docker-dev:
	pnpm --filter api exec docker compose -f docker-compose.dev.yml up -d --build
docker-test:
	pnpm --filter api exec docker compose -f docker-compose.test.yml up -d --build
be-d:
	pnpm --filter api dev
